[项目预览](https://hcm083214.github.io/audio-player/)

# 音乐播放器

- 播放控制
- 播放进度条控制
- 歌词显示及高亮
- 播放模式设置

## 播放器属性归类

按照播放器的功能划分，对播放器的属性和DOM元素归类，实现同一功能的元素和属性保存在同一对象中，便于管理和操作

```js
const control = { //存放播放器控制
    play: document.querySelector('#myplay'),
	...
    index: 2,//当前播放歌曲序号
	...
}

const audioFile = { //存放歌曲文件及相关信息
    file: document.getElementsByTagName('audio')[0],
    currentTime: 0,
    duration: 0,
}

const lyric = { // 歌词显示栏配置
    ele: null,
    totalLyricRows: 0,
    currentRows: 0,
    rowsHeight: 0,
}

const modeControl = { //播放模式
    mode: ['顺序', '随机', '单曲'],
    index: 0
}

const songInfo = { // 存放歌曲信息的DOM容器
    name: document.querySelector('.song-name'),
	...
}
```



## 播放控制

功能：控制音乐的播放和暂停及相应图标修改

所用API：`audio.play()` 和 `audio.pause()`

```js
function playerHandle() {
    const play = control.play;
    control.isPlay ? audioFile.file.play() : audioFile.file.pause();
    if (control.isPlay) {
		//音乐播放，更改图标及开启播放动画
        play.classList.remove('songStop');
        play.classList.add('songStart');
        control.albumCover.classList.add('albumRotate');
        control.albumCover.style.animationPlayState = 'running';
    } else {
        //音乐暂停，更改图标及暂停播放动画
		...
    }
}

control.play.addEventListener('click',()=>{
    control.isPlay = !control.isPlay;
    playerHandle();
} );
```

## 播放进度条控制

功能：实时更新播放进度，点击进度条调整歌曲播放进度

所用API：`audio timeupdate`事件，`audio.currentTime`

```js
// 播放进度实时更新
audioFile.file.addEventListener('timeupdate', lyricAndProgressMove);
// 通过拖拽调整进度
control.progressDot.addEventListener('click', adjustProgressByDrag);
// 通过点击调整进度
control.progressWrap.addEventListener('click', adjustProgressByClick);
```

播放进度实时更新：通过修改相应DOM元素的位置或者宽度进行修改

```js
function lyricAndProgressMove() {
    const audio = audioFile.file;
    const controlIndex = control.index;
	// 歌曲信息初始化
    const songLyricItem = document.getElementsByClassName('song-lyric-item');
    if (songLyricItem.length == 0) return;
    let currentTime = audioFile.currentTime = Math.round(audio.currentTime);
    let duration = audioFile.duration = Math.round(audio.duration);

    //进度条移动
    const progressWrapWidth = control.progressWrap.offsetWidth;
    const currentBarPOS = currentTime / duration * 100;
    control.progressBar.style.width = `${currentBarPOS.toFixed(2)}%`;
    const currentDotPOS = Math.round(currentTime / duration * progressWrapWidth);
    control.progressDot.style.left = `${currentDotPOS}px`;

    songInfo.currentTimeSpan.innerText = formatTime(currentTime);

}
```

拖拽调整进度：通过拖拽移动进度条，并且同步更新歌曲播放进度

```js
function adjustProgressByDrag() {
    const fragBox = control.progressDot;
    const progressWrap = control.progressWrap
    drag(fragBox, progressWrap)
}

function drag(fragBox, wrap) {
    const wrapWidth = wrap.offsetWidth;
    const wrapLeft = getOffsetLeft(wrap);

    function dragMove(e) {
        let disX = e.pageX - wrapLeft;
        changeProgressBarPos(disX, wrapWidth)
    }
    fragBox.addEventListener('mousedown', () => { //拖拽操作
        //点击放大方便操作
        fragBox.style.width = `14px`;fragBox.style.height = `14px`;fragBox.style.top = `-7px`;
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', dragMove);
            fragBox.style.width = `10px`;fragBox.style.height = `10px`;fragBox.style.top = `-4px`;
        })
    });
}

function changeProgressBarPos(disX, wrapWidth) { //进度条状态更新
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
```

点击进度条调整：通过点击进度条，并且同步更新歌曲播放进度

```js
function adjustProgressByClick(e) {

    const wrap = control.progressWrap;
    const wrapWidth = wrap.offsetWidth;
    const wrapLeft = getOffsetLeft(wrap);
    const disX = e.pageX - wrapLeft;
    changeProgressBarPos(disX, wrapWidth)
}
```

## 歌词显示及高亮

功能：根据播放进度，实时更新歌词显示，并高亮当前歌词（通过添加样式）

所用API：`audio timeupdate`事件，`audio.currentTime`

```js
// 歌词显示实时更新
audioFile.file.addEventListener('timeupdate', lyricAndProgressMove);

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
                songInfo.lyricWrap.scrollTo(0, `${rowsHeight * (index - 5)}`)
            }

        }
    })
}
```

## 播放模式设置



```js

```

