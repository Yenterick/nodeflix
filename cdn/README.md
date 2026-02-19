# HLS CDN Directory Structure

This server delivers HLS (HTTP Live Streaming) content using Nginx.

--- 

## Directory Layout

<pre>/var/www/hls/
├── pics/
│   └── $1.jpeg
├── movies/
│   └── $1/
│       ├── master.m3u8
│       ├── segment_000.ts
│       ├── banner.jpeg
│       └── thumbnail.jpeg
└── series/
    └── $1/
        ├── thumbnail.jpeg
        └── $1/
            └── $1/
                ├── master.m3u8
                ├── segment_000.ts
                └── thumbnail.jpeg</pre>

--- 

### Entry Append to Database Example

<pre>node mediaProcessor.js --m | node mediaProcessor.js --s</pre>

---

### FFMPEG Conversion Example

<pre>ffmpeg -i input.mp4 -hls_time 10 -hls_list_size 0 -hls_segment_filename "segment_%03d.ts" -f hls master.m3u8</pre>

---

### URL Example

<pre>http://server/movies/1/main.m3u8</pre>