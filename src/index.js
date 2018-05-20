import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

class YouTubePlayer extends React.Component {
    constructor() {
        super();
        this.state = {
            startAt: 14,
            stopAt: 18,
            done: false
        };
    }
    onYouTubeIframeAPIReady = () => {
        this.player = new YT.Player('player', {
            events: {
                'onReady': this.onPlayerReady,
                'onStateChange': this.onPlayerStateChange,
            }
        });
    }
    onPlayerReady = (event) => {}
    onPlayerStateChange = (event) => {
        if (event.data == YT.PlayerState.PLAYING && !this.done) {
            const { startAt, stopAt } = this.state;
            const playDurationInSeconds = (startAt > stopAt) ? 0 : (stopAt - startAt);
            this.timeOutId = setTimeout(this.pauseVideo, playDurationInSeconds * 1000);
            this.setState({ done: true });
        }
    }
    handleOnClickPlay = (event) => {
        this.playVideo(event);
    }
    playVideo = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ done: false });
        clearTimeout(this.timeOutId);
        this.player.seekTo(this.state.startAt);
        this.player.playVideo();
    };
    pauseVideo = () => {
        this.player.pauseVideo();
    }
    handleOnInput = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const name = event.target.name;
        const value = parseFloat(event.target.value);
        this.setState((state) => ({
            [name]: isNaN(value) ? state[name] : value
        }));
    };
    componentDidMount() {
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
        // Keybaord events
        document.addEventListener('keyup', (event) => {
            const keyName = event.key;
            if (keyName === 'p') {
                this.playVideo(event);
            }
        });
    }
    render() {
        const { startAt, stopAt } = this.state;
        return(
            <div className="container">
                <h1>Learn any language Tube</h1>
                <iframe id="player" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" width="640" height="390" src="https://www.youtube.com/embed/eIho2S0ZahI?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1"></iframe>
                <div>
                    <label for="startAt">Start at (in seconds):</label>
                    <input
                        id="startAt"
                        name="startAt"
                        type="text"
                        value={startAt}
                        onChange={this.handleOnInput}
                    />
                </div>
                <div>
                    <label for="stopaAt">Stop at (in seconds):</label>
                    <input
                        id="stopAt"
                        name="stopAt"
                        type="text"
                        value={stopAt}
                        onChange={this.handleOnInput}
                    />
                </div>
                <button
                    onClick={this.handleOnClickPlay}
                >
                    Play (P)
                </button>
            </div>
        );
    }
};

ReactDOM.render(
    <div>
        <YouTubePlayer />
    </div>,
    document.getElementById('app')
);

// TODO:
// Load this script dynamically
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const  firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
