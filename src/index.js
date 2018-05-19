import './styles.css';

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const  firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// APP
const state = {
    startAt: 14,
    stopAt: 18
};
const $playButton = document.getElementById('playButton');
const $startAt = document.getElementById('startAt');
const $stopAt = document.getElementById('stopAt');
let player;
let done = false;
let timeOutId;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'eIho2S0ZahI',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function onPlayerReady(event) {}

function pauseVideo() {
    player.pauseVideo();
}
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        const { startAt, stopAt } = state;
        const playDurationInSeconds = (startAt > stopAt)? 0 : (stopAt - startAt);
        timeOutId = setTimeout(pauseVideo,  playDurationInSeconds * 1000);
        done = true;
    }
}


const playVideo = (event) => {
    event.preventDefault();
    event.stopPropagation();
    done = false;
    clearTimeout(timeOutId);
    player.seekTo(state.startAt);
    player.playVideo();
};
$playButton.addEventListener('click', playVideo);



const handleOnInput = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const name = event.target.name;
    const value = parseFloat(event.target.value);
    state[name] = isNaN(value) ? state[name] : value;    
};
$startAt.addEventListener('input', handleOnInput);
$stopAt.addEventListener('input', handleOnInput);

// Keybaord events
document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    if(keyName === 'p') {
        playVideo(event);
    }
});