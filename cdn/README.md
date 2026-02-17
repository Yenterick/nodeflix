# HLS CDN Directory Structure

This server delivers HLS (HTTP Live Streaming) content using Nginx.

## Directory Layout

<pre>/var/www/hls/
├── movies/
│   └── 1/
│       ├── main.m3u8
│       ├── segment_000.ts
│       └── thumbnail.jpeg
└── series/
    └── 1/
        └── 1/
            ├── main.m3u8
            ├── segment_000.ts
            └── thumbnail.jpeg</pre>

--- 

## Example URL

<pre>http://server/movies/1/main.3u8</pre>