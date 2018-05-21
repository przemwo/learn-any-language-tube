import React from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

class YouTubePlayer extends React.Component {
    constructor() {
        super();
        this.state = {
            video: [
                {
                    startAt: 14,
                    stopAt: 18,
                    source: "The human voice: It's the instrument we all play.",
                    target: ""
                },
                {
                    startAt: 18.5,
                    stopAt: 23.5,
                    source: "It's the most powerful sound in the world, probably. It's the only one that can start a war or say 'I love you.'",
                    target: ""
                },
            ],
            videoItemId: 0,
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
            const { startAt, stopAt } = this.state.video[this.state.videoItemId];
            const playDurationInSeconds = (startAt > stopAt) ? 0 : (stopAt - startAt);
            this.timeOutId = setTimeout(this.pauseVideo, playDurationInSeconds * 1000);
            this.setState({ done: true });
        }
    }
    handleOnClickPlay = (id) => (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState(
            { videoItemId: id },
            this.playVideo
        );
    }
    playVideo = () => {
        this.setState({ done: false });
        clearTimeout(this.timeOutId);
        this.player.seekTo(this.state.video[this.state.videoItemId].startAt);
        this.player.playVideo();
    };
    pauseVideo = () => {
        this.player.pauseVideo();
    }
    handleOnInput = (id) => (event) => {
        event.preventDefault();
        event.stopPropagation();
        const name = event.target.name;
        const value = event.target.value;
        const newVideo = this.state.video.map((video, index) => {
            if(index === id) {
                return Object.assign({}, video, { [name]: value })
            }
            return video;
        });
        this.setState({ video: newVideo });
    };
    componentDidMount() {
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
        // Keybaord events
        document.addEventListener('keyup', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const keyName = event.key;
            if (keyName === 'p') {
                this.playVideo();
            }
        });
    }
    render() {
        const { video } = this.state;
        return(
            <div className="container">
                <h1>Learn any language Tube</h1>
                <iframe id="player" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" width="640" height="390" src="https://www.youtube.com/embed/eIho2S0ZahI?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1"></iframe>
                {video.map((item, index) => (
                    <VideoItem
                        key={index}
                        id={index}
                        {...item}
                        handleOnInput={this.handleOnInput(index)}
                        handleOnClickPlay={this.handleOnClickPlay(index)}
                    />
                ))}
            </div>
        );
    }
};

class VideoItem extends React.Component {
    render() {
        const { startAt, stopAt, source, handleOnInput, handleOnClickPlay } = this.props;
        return (
            <div>
                <div>
                    <label for="startAt">Start at (in seconds):</label>
                    <input
                        name="startAt"
                        type="text"
                        value={startAt}
                        onChange={handleOnInput}
                    />
                </div>
                <div>
                    <label for="stopaAt">Stop at (in seconds):</label>
                    <input
                        name="stopAt"
                        type="text"
                        value={stopAt}
                        onChange={handleOnInput}
                    />
                </div>
                <div>{source}</div>
                <button
                    onClick={handleOnClickPlay}
                >
                    Play (P)
                </button>
            </div>
        )
    }
}

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
