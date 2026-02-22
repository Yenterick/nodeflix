# NodeFlix HLS Content Delivery Network
##### V1.0.0

These are all the files needed to convert and deliver content for NodeFlix.
All videos are in m3u8 (HLS) format to reduce the load on the client when downloading them, allowing for segmented streaming.
All the images are in jpeg format.

--- 

## Directory Layout

<pre>
root/
├─ var/
│  ├─ www/
│  │  ├─ uploads/
│  │  │  ├─ movieInput.mp4
│  │  │  ├─ movieThumbnail.jpg
│  │  │  ├─ seriesThumbnail.jpg
│  │  │  ├─ serieInput/
│  │  │  │  ├─ 1/
│  │  │  │  │  ├─ 2.mp4
│  │  │  │  │  ├─ 1.mp4
│  │  │  │  ├─ 2/
│  │  ├─ hls/
│  │  │  ├─ movies/
│  │  │  │  ├─ id/
│  │  │  │  │  ├─ master.m3u8
│  │  │  │  │  ├─ thumbnail.jpeg/
│  │  │  ├─ series/
│  │  │  │  ├─ id/
│  │  │  │  │  ├─ thumbnail.jpeg
│  │  │  │  │  ├─ 1/
│  │  │  │  │  │  ├─ 1/
│  │  │  │  │  │  │  ├─ master.m3u8
│  │  │  │  │  │  │  ├─ thumbnail.jpeg
│  │  │  │  │  │  ├─ 2/
│  │  │  │  │  ├─ 2/
</pre>

--- 

### Entry Append to Database Example

The script uses /var/www/uploads/ as its base.

<pre>node mediaProcessor.js --m --r --i movieInput.mp4 --t movieThumbnail.jpeg</pre>

#### --Help Flag STDOUT

<pre>
Usage: node mediaProcessor.js [options]
Options:
   --v, --version    Show version
   --h, --help       Show this help message
   --m, --movie      Process a movie
   --s, --series     Process a series
   --l, --local      Process local media
   --r, --remote     Process remote media
   Movie Process:
       --i, --input      Input file path
       --t, --thumbnail  Thumbnail file path
   Series Process:
       --i, --input      Input folder path
       --t, --thumbnail  Thumbnail file path
</pre>

---

### FFMPEG Conversion Script Example

<pre>ffmpeg -i input.mp4 -hls_time ${Segment duration} -hls_list_size ${Max quantity of segments} -hls_segment_filename "segment_%03d.ts" -f hls master.m3u8</pre>

---

### HLS URL Example

<pre>http://server/movies/${id}/master.m3u8</pre>
<pre>http://server/series/${id}/1/1/master.m3u8</pre>