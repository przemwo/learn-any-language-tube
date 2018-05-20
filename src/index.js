import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

const IFrame = () => {
    return(
        <iframe id="player" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" width="640" height="390" src="https://www.youtube.com/embed/eIho2S0ZahI?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1"></iframe>
    );
};

ReactDOM.render(
    <div>
        <IFrame />
    </div>,
    document.getElementById('app')
);

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
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
window.onYouTubePlayerAPIReady = onYouTubePlayerAPIReady;

function onYouTubePlayerAPIReady() {}


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