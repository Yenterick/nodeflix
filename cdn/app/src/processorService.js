const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');
const SftpClient = require('ssh2-sftp-client');
const mongoose = require('mongoose');

// Temporary directory for HLS segments
const TEMP_BASE = path.join(process.cwd(), 'temp-processing');

// Media processor model to organice the methods
class ProcessorService {
    constructor(sshConfig) {
        this.sshConfig = {
            host: sshConfig.host,
            port: parseInt(sshConfig.port),
            username: sshConfig.username,
            privateKey: fs.readFileSync(sshConfig.keyPath)
        };
        this.sftp = new SftpClient();
    }

    // Checks the directory
    async ensureLocalDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    // Converts videos to hls
    async convertToHls(inputPath, outputDir, onProgress) {
        await this.ensureLocalDir(outputDir);
        
        return new Promise((resolve, reject) => {
            const args = [
                '-i', inputPath,
                '-hls_time', '10',
                '-hls_list_size', '0',
                '-hls_segment_filename', path.join(outputDir, 'segment_%03d.ts'),
                '-f', 'hls',
                path.join(outputDir, 'master.m3u8')
            ];

            const ffmpeg = spawn(ffmpegPath, args);

            ffmpeg.stderr.on('data', (data) => {
                const line = data.toString();
                if (onProgress) onProgress(line);
            });

            ffmpeg.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`ffmpeg exited with code ${code}`));
            });
        });
    }

    // Extracts a thumbnail using FFMPEG
    async extractThumbnail(inputPath, outputDir) {
        return new Promise((resolve, reject) => {
            const outputPath = path.join(outputDir, 'thumbnail.jpeg');
            const args = [
                '-i', inputPath,
                '-ss', '00:00:05.000',
                '-vframes', '1',
                outputPath
            ];

            const ffmpeg = spawn(ffmpegPath, args);

            ffmpeg.on('close', (code) => {
                if (code === 0) resolve(outputPath);
                else reject(new Error(`ffmpeg exited with code ${code}`));
            });
        });
    }

    // Sends the folder
    async uploadFolder(localPath, remotePath) {
        try {
            await this.sftp.connect(this.sshConfig);
            await this.sftp.mkdir(remotePath, true);
            await this.sftp.uploadDir(localPath, remotePath);
        } finally {
            await this.sftp.end();
        }
    }

    // Sends the file
    async uploadFile(localPath, remotePath) {
        try {
            await this.sftp.connect(this.sshConfig);
            const remoteDir = path.dirname(remotePath);
            await this.sftp.mkdir(remoteDir, true);
            await this.sftp.put(localPath, remotePath);
        } finally {
            await this.sftp.end();
        }
    }

    // Delete the temporary directory
    async cleanup(localPath) {
        if (fs.existsSync(localPath)) {
            fs.rmSync(localPath, { recursive: true, force: true });
        }
    }
}

module.exports = ProcessorService;
