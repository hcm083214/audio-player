/*
 * @Author: 黄灿民
 * @Date: 2021-02-21 23:20:42
 * @LastEditTime: 2021-02-23 00:35:27
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
    albumCover: document.querySelector('.albumcover'),
    currentTimeSpan: document.querySelector('.song-time-state'),
    endTimeSpan: document.querySelector('.song-end-state'),
}

function addAudioFile(songList, index = control.index) {
    const audio = document.querySelector('audio');
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
    control.isPlay = !control.isPlay;
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

function showLyric(songList, lrcs, index = control.index) {
    songInfo.name.innerText = songList[index].name;
    songInfo.singer.innerText = songList[index].singer;
    songInfo.album.innerText = songList[index].album;
    songInfo.source.innerText = songList[index].album;
    songInfo.albumCover.style.backgroundImage = `url(${songList[index].pic})`;
    let lyric = songInfo.lyric;
    let template = '';
    lrcs[index].lyric.forEach(item => {
        template += `
            <p class='song-lyric-item'>${item.lineLyric}</p>
        `
    })
    lyric.innerHTML = template;
}

function lyricAndProgressMove(lrcs, index = control.index) {
    const audio = audioFile.file;
    audio.addEventListener('timeupdate', () => {
        const songLyricItem = document.getElementsByClassName('song-lyric-item');
        let currentTime = audioFile.currentTime = Math.round(audio.currentTime);
        let duration = audioFile.duration = Math.round(audio.duration);
        let totalLyricRows = lyric.totalLyricRows = songLyricItem.length;
        let LyricEle = lyric.ele = songLyricItem[0];
        let rowsHeight = lyric.rowsHeight = LyricEle.offsetHeight;
        //歌词移动
        lrcs[index].lyric.forEach((item, index) => {
            if (currentTime === item.time) {
                lyric.currentRows = index;
                songLyricItem[index].classList.add('song-lyric-item-active');
                index > 0 && songLyricItem[index - 1].classList.remove('song-lyric-item-active');
                (index > 5 && index < totalLyricRows - 5) && (songInfo.lyric.style.transform = `translateY(${-rowsHeight * (index - 5)}px)`)
            }
        })
        //进度条移动
        const progressWrapWidth = control.progressWrap.offsetWidth;
        const currentBarPOS = currentTime / duration * 100;
        control.progressBar.style.width = `${currentBarPOS.toFixed(2)}%`;
        const currentDotPOS = Math.round(currentTime / duration * progressWrapWidth);
        control.progressDot.style.left = `${currentDotPOS}px`;

        songInfo.currentTimeSpan.innerText = formatTime(currentTime);
        songInfo.endTimeSpan.innerText = formatTime(duration);
        console.log("🚀 ~ file: index.js ~ line 115 ~ audio.addEventListener ~ progressWrapWidth", progressWrapWidth, currentBarPOS, currentDotPOS)
    })
}

function formatTime(time) {
    let m = Math.round(time / 60);
    m = m < 10 ? "0" + m : m;
    let s = Math.round(time % 60);
    s = s < 10 ? "0" + s : s;
    return `${m}:${s}`
}

function reload(songList, index = control.index) {
    const audio = document.querySelector('audio');
    audio.src = songList[index].url;
    showLyric(songList, lrcs);
    control.isPlay ? audioFile.file.play() : audioFile.file.pause();
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

function init() {
    addAudioFile(songList);
    showLyric(songList, lrcs);
    playerHandle();
    lyricAndProgressMove(lrcs);
}
init();

control.play.addEventListener('click', playerHandle);
control.mode.addEventListener('click', changePlayMode);
control.prev.addEventListener('click', prevHandle);
control.next.addEventListener('click', nextHandle);