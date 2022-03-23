const play = document.querySelector('.fa-play')
const pause = document.querySelector('.fa-pause')
const songTime = document.querySelector('.song_time')
const songTimer = document.querySelector('.song_timer')
const animation = document.querySelectorAll('.circle')
const songName = document.querySelector('.song-name')
const artistName = document.querySelector('.artist-name')
const seekBar = document.querySelector('.seek_bar div i')
const btnBack = document.querySelector('.fa-backward-step')
const btnNext = document.querySelector('.fa-forward-step')
const playList = document.querySelector('.play-list')
const openPlayList = document.querySelector('.fa-ellipsis-vertical')
const closePlayList = document.querySelector('.fa-xmark')
const blockPlayList = document.querySelector('.block')


let interval,
    widthSeekBar = 0,
    intervalSeekBar,
    minTimer = '00',
    secTimer = '00',
    sum = 0,
    trackNum = 0,
    track = musicList[trackNum],
    audio = new Audio(track.src)
    
//выводим название песни и артиста
artistName.innerText = track.artistName
songName.innerText = track.songName
//функция для перевода секунд в формат 00:00
function time(seconds){
    min = Math.floor(seconds / 60)
    sec = seconds % 60
    if(min < 10){
        min = '0' + min
    }
    if(sec < 10){
        sec = '0' + sec
    }
    return `${min}:${sec}`
}
//функция таймера
function timer(){
    //останавливаем таймер когда заканчивается песня
    if(songTimer.innerText === songTime.innerText){
        return
    }
    secTimer++
     if(secTimer < 10) {
        secTimer = '0' + secTimer
    }
    if(secTimer > 9){
        secTimer = secTimer            
    }
    if(secTimer > 59){
        minTimer++
        minTimer = '0'+ minTimer
        secTimer = '00'
    }
    //не предусмотренно прослушивание более часа
    if(minTimer > 59){
        return
    }
    songTimer.innerText = `${minTimer}:${secTimer}`
}
// включаем анимацию
function addAnimation(elem){
    elem.forEach(i => i.classList.add('active'))
    
}
// выключаем анимацию
function removeAnimation(elem){
    elem.forEach(i => i.classList.remove('active'))
}
// функция для ползунка seek bar
function activeSeekBar(){
    if(widthSeekBar){
        sum += 100 / widthSeekBar
        seekBar.style.width = sum + '%'
    }
    //обнуляем значения по завершению трека
    if(songTimer.innerText === songTime.innerText){
        clearInterval(interval)
        pause.classList.add('none')
        play.classList.remove('none')
        removeAnimation(animation)
        songTime.innerText = '00:00'
        songTimer.innerText = '00:00'
        minTimer = '00'
        secTimer = '00'
        sum = 0
        nextTrack()
    }
}

//функции открытие/закрытие плейлиста
function openList(){
    playList.style.display = 'block'
}
function closeList(){
    playList.style.display = 'none'
}
//event open/close play list
openPlayList.addEventListener('click', openList)
closePlayList.addEventListener('click', closeList)

//функция добавлния треков в play list
function addBlockPlayList(){
    let list = musicList.map((element, index)=>
    `
    <div class="track">
    <p class="number">${index + 1}</p>
    <p class="song">${element.songName}</p>
    <p class="artist">${element.artistName}</p>
    </div>
    `    
    )
    blockPlayList.insertAdjacentHTML('afterbegin', list.join(''))
}
// функция обновлления данных
function updateData(){
    track = musicList[trackNum]
    artistName.innerText = track.artistName
    songName.innerText = track.songName
    audio = new Audio(track.src)
    clearInterval(interval)
    pause.classList.add('none')
    play.classList.remove('none')
    removeAnimation(animation)
    songTime.innerText = '00:00'
    songTimer.innerText = '00:00'
    minTimer = '00'
    secTimer = '00'
    sum = 0
}

//добавляем в плей лист список доступных треков
    addBlockPlayList()
//запускаем треки с плейлиста
blockPlayList.addEventListener('click', function(e){
    //находим в блоке плейлиста порядковый номер трека
    let num = +e.path[1].querySelector('.number').innerText
    //присваеваем номер трека к trackNum и включаем трек
    audio.pause()
    trackNum = num - 1
    updateData()
    playStart()
    //закрываем play list
    closeList()
})

//событие по переключению трека вперед
function nextTrack(){
    if(trackNum < musicList.length-1){
        audio.pause()
        trackNum++
        updateData()
        playStart()
    } 
    else {
        return
    }
}
btnNext.addEventListener('click', nextTrack)
//событие по переключению трека назад
btnBack.addEventListener('click', ()=> {
    
    if(trackNum > 0 ){
        audio.pause()
        trackNum--
        updateData()
        playStart()
    } else {
        return
    }
})
//функция старта audio 
function playStart(){
        //включаем таймер
        clearInterval(interval)
        interval = setInterval(timer, 1000)
        //включаем seek bar
        clearInterval(intervalSeekBar)
        intervalSeekBar = setInterval(activeSeekBar, 1000)
        //отображаем время трека
        setTimeout(()=> {
            //проверяем получили ли мы данные по треку
            if(audio.duration){
                songTime.innerText = time(Math.floor(audio.duration))
                widthSeekBar = Math.floor(audio.duration) 
                //включаем анимацию
                addAnimation(animation)
            }
            return
            
        },200)
            audio.play()
            //отображаем таймер
            timer()
            play.classList.add('none')
            pause.classList.remove('none')
}
play.addEventListener('click', playStart)

//сщбытие pause
pause.addEventListener('click', ()=>{
    //останавливаем таймер
    clearInterval(interval)
    //останавливаем seek bar
    clearInterval(intervalSeekBar)
    //отключаем анимацию
    removeAnimation(animation)
    //останавливаем трек
    audio.pause()
    //меняем классы
    pause.classList.add('none')
    play.classList.remove('none')
})


