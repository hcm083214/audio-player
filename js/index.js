/*
 * @Author: 黄灿民
 * @Date: 2021-02-21 23:20:42
 * @LastEditTime: 2021-02-22 01:08:19
 * @LastEditors: 黄灿民
 * @Description: 
 * @FilePath: \04.网易云音乐\js\index.js
 */
const control = {
    prev: document.querySelector('.songPrev'),
    play: document.querySelector('#myplay'),
    next: document.querySelector('.songNext'),
    isPlay: false,
    albumCover: document.querySelector('.albumcover'),
    index: 0,
}
const audioFile = {
    file: document.getElementsByTagName('audio'),
}

const songInfo = {
    name: document.querySelector('.song-name'),
    album: document.querySelector('.song-album'),
    singer: document.querySelector('.singer'),
    source: document.querySelector('.song-sour'),
    lyric: document.querySelector('.song-lyric'),
}

function addAudioFile(songList) {
    const body = document.querySelector('body')
    songList.forEach(audio => {
        const audioFile = document.createElement("AUDIO");
        audioFile.src = audio.url;
        body.appendChild(audioFile);
    })

}

function changePlayMode() {

}
function player() {
    control.isPlay = !control.isPlay;
    control.isPlay ? audioFile.file[control.index].play() : audioFile.file[control.index].pause();
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
    lyric = songInfo.lyric;
    lrcs[index].lyric.forEach(item=>{
        const p = document.createElement("P");
        p.innerText =item.lineLyric
        lyric.appendChild(p);
    })
}
function init() {
    addAudioFile(songList);
    showLyric(songList, lrcs);
}
init();
// player();
control.play.addEventListener('click', player)