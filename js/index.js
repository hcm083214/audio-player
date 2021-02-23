/*
 * @Author: 黄灿民
 * @Date: 2021-02-21 23:20:42
<<<<<<< Updated upstream
<<<<<<< HEAD
 * @LastEditTime: 2021-02-24 00:02:33
=======
 * @LastEditTime: 2021-02-24 00:00:39
>>>>>>> gh-pages
=======
 * @LastEditTime: 2021-02-23 23:52:55
>>>>>>> Stashed changes
 * @LastEditors: 黄灿民
 * @Description: 
 * @FilePath: \05.网易云音乐\js\index.js
 */
const control = {
    prev: document.querySelector('.songPrev'),
    play: document.querySelector('#myplay'),
    next: document.querySelector('.songNext'),
    mode: document.querySelector('#mycycle'),
    isPlay: false,
    albumCover: document.querySelector('.albumcover'),
    index: 2,//当前播放歌曲序号
    progressBar: document.querySelector('.songBarNow'),
    progressDot: document.querySelector('.songBarDot'),
    progressWrap: document.querySelector('.songState'),
}

const audioFile = {
    file: document.getElementsByTagName('audio')[0],
    currentTime: 0,
    duration: 0,
}

const lyric = {
    ele: null,
    totalLyricRows: 0,
    currentRows: 0,
    rowsHeight: 0,
}

const modeControl = {
    mode: ['顺序', '随机', '单曲'],
    index: 0
}

const songInfo = {
    name: document.querySelector('.song-name'),
    album: document.querySelector('.song-album'),
    singer: document.querySelector('.singer'),
    source: document.querySelector('.song-sour'),
    lyric: document.querySelector('.song-lyric-box'),
    lyricWrap: document.querySelector('.song-lyric'),
    albumCover: document.querySelector('.albumcover'),
    currentTimeSpan: document.querySelector('.song-time-state'),
    endTimeSpan: document.querySelector('.song-end-state'),
}

function addAudioFile(songList, index = control.index) {
    const audio = audioFile.file;
    audio.src = songList[index].url
}

function changePlayMode() {
    modeControl.index = ++modeControl.index % 3;
    const mode = control.mode;
    modeControl.index === 0 ?
        mode.setAttribute("class", "playerIcon songCycleOrder") :
        modeControl.index === 1 ?
            mode.setAttribute("class", "playerIcon songCycleRandom ") :
            mode.setAttribute("class", "playerIcon songCycleOnly")
}

function playerHandle() {
    control.isPlay ? audioFile.file.play() : audioFile.file.pause();
    if (control.isPlay) {
        control.play.classList.remove('songStop');
        control.play.classList.add('songStart');
        control.albumCover.classList.add('albumRotate');
        control.albumCover.style.animationPlayState = 'running';
    } else {
        control.play.classList.add('songStop');
        control.play.classList.remove('songStart');
        control.albumCover.style.animationPlayState = 'paused';
    }
}

function showLyric(songList, lrcs, controlIndex = control.index) {
    songInfo.name.innerText = songList[controlIndex].name;
    songInfo.singer.innerText = songList[controlIndex].singer;
    songInfo.album.innerText = songList[controlIndex].album;
    songInfo.source.innerText = songList[controlIndex].album;
    songInfo.albumCover.style.backgroundImage = `url(${songList[controlIndex].pic})`;
    let lyric = songInfo.lyric;
    let template = '';
    lrcs[controlIndex].lyric.forEach(item => {
        template += `
            <p class='song-lyric-item'>${item.lineLyric}</p>
        `
    })
    lyric.innerHTML = template;
    let duration = audioFile.duration = Math.round(audioFile.file.duration);
    songInfo.endTimeSpan.innerText = formatTime(duration);
}

function lyricAndProgressMove() {
    const audio = audioFile.file;
    const controlIndex = control.index;

    const songLyricItem = document.getElementsByClassName('song-lyric-item');
    if (songLyricItem.length == 0) return;
    let currentTime = audioFile.currentTime = Math.round(audio.currentTime);
    let duration = audioFile.duration = Math.round(audio.duration);
    let totalLyricRows = lyric.totalLyricRows = songLyricItem.length;
    let LyricEle = lyric.ele = songLyricItem[0];
    let rowsHeight = lyric.rowsHeight = LyricEle && LyricEle.offsetHeight;
    //歌词移动
    lrcs[controlIndex].lyric.forEach((item, index) => {
        if (currentTime === item.time) {
            lyric.currentRows = index;
            songLyricItem[index].classList.add('song-lyric-item-active');
            index > 0 && songLyricItem[index - 1].classList.remove('song-lyric-item-active');
            if (index > 5 && index < totalLyricRows - 5) {
                // console.log("🚀 ~ file: index.js ~ line 118 ~ lrcs[index].lyric.forEach ~ index", index)
                songInfo.lyricWrap.scrollTo(0, `${rowsHeight * (index - 5)}`)
            }
            // (scrollTo(0,`${rowsHeight * (index - 5)}`))
            // (index > 5 && index < totalLyricRows - 5) && (songInfo.lyric.style.transform = `translateY(${-rowsHeight * (index - 5)}px)`)
        }
    })
    //进度条移动
    const progressWrapWidth = control.progressWrap.offsetWidth;
    const currentBarPOS = currentTime / duration * 100;
    control.progressBar.style.width = `${currentBarPOS.toFixed(2)}%`;
    const currentDotPOS = Math.round(currentTime / duration * progressWrapWidth);
    control.progressDot.style.left = `${currentDotPOS}px`;

    songInfo.currentTimeSpan.innerText = formatTime(currentTime);
    // songInfo.endTimeSpan.innerText = formatTime(duration);

}

function formatTime(time) {
    let m = Math.floor(time / 60);
    m = m < 10 ? "0" + m : m;
    let s = time % 60;
    s = s < 10 ? "0" + s : s;
    return `${m}:${s}`
}

function reload(songList, controlIndex = control.index) {
    const audio = document.querySelector('audio');
    audio.src = songList[controlIndex].url;
    showLyric(songList, lrcs);
    // songInfo.lyric.style.transform = `translateY(0px)`
    songInfo.lyricWrap.scrollTo(0, 0);
    audio.play()
}


function prevHandle() {
    const modeIndex = modeControl.index;
    const songListLens = songList.length;
    if (modeIndex == 0) {//顺序播放
        let index = --control.index;
        index == -1 ? (index = songListLens - 1) : index;
        control.index = index % songListLens;
    } else if (modeIndex == 1) {//随机播放
        const randomNum = Math.random() * (songListLens - 1);
        control.index = Math.round(randomNum);
    } else if (modeIndex == 2) {//单曲
    }
    reload(songList);
}

function nextHandle() {
    const modeIndex = modeControl.index;
    const songListLens = songList.length;
    if (modeIndex == 0) {//顺序播放
        control.index = ++control.index % songListLens;
    } else if (modeIndex == 1) {//随机播放
        const randomNum = Math.random() * (songListLens - 1);
        control.index = Math.round(randomNum);
    } else if (modeIndex == 2) {//单曲
    }
    reload(songList);
}

function getOffsetLeft(e) {
    let t = e.offsetTop;
    let l = e.offsetLeft;
    while (e = e.offsetParent) {
        t += e.offsetTop;
        l += e.offsetLeft;
    }
    return l;
}

function drag(fragBox, wrap) {
    const wrapWidth = wrap.offsetWidth;
    const wrapLeft = getOffsetLeft(wrap);

    function dragMove(e) {
        let disX = e.pageX - wrapLeft;
        changeProgressBarPos(disX, wrapWidth)
    }
    fragBox.addEventListener('mousedown', () => {
        fragBox.style.width = `14px`;
        fragBox.style.height = `14px`;
        fragBox.style.top = `-7px`;
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', dragMove);
            fragBox.style.width = `10px`;
            fragBox.style.height = `10px`;
            fragBox.style.top = `-4px`;
        })
    });


}

function changeProgressBarPos(disX, wrapWidth) {
    const audio = audioFile.file
    const duration = audioFile.duration
    let dotPos
    let barPos

    if (disX < 0) {
        dotPos = -4
        barPos = 0
        audio.currentTime = 0
    } else if (disX > 0 && disX < wrapWidth) {
        dotPos = disX
        barPos = 100 * (disX / wrapWidth)
        audio.currentTime = duration * (disX / wrapWidth)
    } else {
        dotPos = wrapWidth - 4
        barPos = 100
        audio.currentTime = duration
    }
    control.progressDot.style.left = `${dotPos}px`
    control.progressBar.style.width = `${barPos}%`
}

function adjustProgressByDrag() {
    const fragBox = control.progressDot;
    const progressWrap = control.progressWrap
    drag(fragBox, progressWrap)
}

<<<<<<< HEAD

=======
>>>>>>> gh-pages
function adjustProgressByClick(e) {

    const wrap = control.progressWrap;
    const wrapWidth = wrap.offsetWidth;
    const wrapLeft = getOffsetLeft(wrap);
    const disX = e.pageX - wrapLeft;
    changeProgressBarPos(disX, wrapWidth)
}

addAudioFile(songList);
function init() {
    showLyric(songList, lrcs);
    playerHandle();
}
// init();
audioFile.file.addEventListener('loadeddata', init);

control.play.addEventListener('click',()=>{
    control.isPlay = !control.isPlay;
    playerHandle();
} );
control.mode.addEventListener('click', changePlayMode);
control.prev.addEventListener('click', prevHandle);
control.next.addEventListener('click', nextHandle);
audioFile.file.addEventListener('timeupdate', lyricAndProgressMove);
control.progressDot.addEventListener('click', adjustProgressByDrag);
audioFile.file.addEventListener('ended', nextHandle);
control.progressWrap.addEventListener('click', adjustProgressByClick)