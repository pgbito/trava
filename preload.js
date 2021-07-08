document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById('dwb').addEventListener("click", async function () {
        if (!require('fs').existsSync(__dirname + '/videos')) {
            require('fs').mkdirSync(__dirname + '/videos')
        }
        var url = document.getElementById("url").value;
        if (!url || url.length == 0) {
            alert('No url provided')
            location.reload()
        }
        if (is_url(url) === false) {
            alert("This isn't a url")
            location.reload()
        }

        if (is_url(url) === true) {
            if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
                let videoInfo = await info(url)


                alert(`Descargando ${videoInfo.title} en ${__dirname}/videos`)
                download(url, __dirname + '/videos', function () {
                    alert('downloaded')
                })
            }
            else {
                alert("This isn't a youtube URL.")
                location.reload()
            }

        }


    })


})











function is_url(str) {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    } else {
        return false;
    }
}
async function download(args, PP, callback) {
    if (is_url(args) == true) {
        const url = args ? args.replace(/<(.+)>/g, "$1") : "";
        if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
            try {
                let ref = args
                if (ref !== null || ref) {


                    const path = `${PP}/trava_${delSpaces((await require('ytdl-core').getInfo(ref)).videoDetails.title)}.mp4`
                    try {
                        if (require('fs').existsSync(path)) return console.log('Video already downloaded.');
                    } catch (err) {
                        console.error(err)
                    }
                    let options = ['-loglevel', '8', '-hide_banner', '-progress', 'pipe:3', '-i', 'pipe:4', '-i', 'pipe:5', '-map', '0:a', '-map', '1:v', '-c:v', 'copy', path,]
                    const audio = require('ytdl-core')(ref, { quality: 'highestaudio' })
                    const video = require('ytdl-core')(ref, { quality: 'highestvideo' })
                    const ffmpegProcess = require('child_process').spawn(require('ffmpeg-static'), options, {
                        windowsHide: true,
                        stdio: [
                            'inherit', 'inherit', 'inherit',
                            'pipe', 'pipe', 'pipe',
                        ],
                    });
                    ffmpegProcess.on('close', () => {
                        return callback()
                    });

                    audio.pipe(ffmpegProcess.stdio[4]);
                    video.pipe(ffmpegProcess.stdio[5]);

                } else {
                    console.log('No video URL given')
                }
            } catch (error) {
                console.error(error)
            }
        }else {
            console.log('invalid url')
        }
    }

}
function delSpaces(string = '', spacesReplacement = '') {
    let x = []
    if (!spacesReplacement) spacesReplacement = '_'
    string.split('').forEach(element => {
        if (element == ' ') {
            x.push(spacesReplacement)
        }
        if (element == '(' || element == ')' || element == '[' || element == ']') { x.push(spacesReplacement) }
        else x.push(element)
    });
    return x.join('')
}

function is_url(str) {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    } else {
        return false;
    }
}
async function info(args = '', sq) {
    if (args.length == 1 || args.length == 0) return console.log('NO url provided')
    if (is_url(args)) {
        const url = args ? args.replace(/<(.+)>/g, "$1") : "";
        if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
            let info = await require("ytdl-core").getInfo(url)
            if (info) {
                return {
                    title: info.videoDetails.title
                    , id: info.videoDetails.videoId
                    , url: info.videoDetails.video_url
                    , thumb: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
                    , author: info.videoDetails.author
                    , description: info.videoDetails.description
                    , keywords: info.videoDetails.keywords
                }
            }
            else {
                return 400
            }


        } else if (url.match(/^https?:\/\/(soundcloud\.com)\/(.*)$/gi)) {


            let songInfo = await require('soundcloud-downloader').default.getInfo(url);

            if (songInfo) {
                return {
                    id: songInfo.permalink,
                    title: songInfo.title,
                    url: songInfo.permalink_url,
                    img: songInfo.artwork_url,
                    ago: songInfo.last_modified,
                };
            } else return 400
        } else {
            console.log('invalid url')
        }
    } else {


        if ((await require('yt-search').search(args)).videos.length !== 0) {
            let info = await require("ytdl-core").getInfo((await require('yt-search').search(args)).videos[0].url)
            return {
                title: info.videoDetails.title
                , id: info.videoDetails.videoId
                , url: info.videoDetails.video_url
                , thumb: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
                , author: info.videoDetails.author
                , description: info.videoDetails.description
                , keywords: info.videoDetails.keywords
            }
        }
        else {
            return 400
        }


    }



    function is_url(str) {
        let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str)) {
            return true;
        } else {
            return false;
        }
    }

}
