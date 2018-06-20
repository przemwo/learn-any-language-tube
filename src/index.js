import React from 'react';
import ReactDOM from 'react-dom';

import TextBox from './components/TextBox';
import Editor from './components/Editor';
import { video } from './data';

import * as styles from './styles.css';

class YouTubePlayer extends React.Component {
    constructor() {
        super();
        this.state = {
            video,
            playingVideoItemId: null,
            lastPlayedVideoItemId: 0,
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
            const { startAt, stopAt } = this.state.video[this.state.playingVideoItemId];
            const playDurationInSeconds = (startAt > stopAt) ? 0 : (stopAt - startAt);
            this.timeOutId = setTimeout(this.pauseVideo, playDurationInSeconds * 1000);
            this.setState({ done: true });
        }
    }
    handleOnClickPlay = (id) => (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState(
            {
                playingVideoItemId: id,
                lastPlayedVideoItemId: id
            },
            this.playVideo
        );
    }
    playVideo = () => {
        this.setState({ done: false });
        clearTimeout(this.timeOutId);
        this.player.seekTo(this.state.video[this.state.playingVideoItemId].startAt);
        this.player.playVideo();
    };
    pauseVideo = () => {
        this.player.pauseVideo();
        this.setState({ playingVideoItemId: null });
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
                // this.playVideo();
                this.handleOnClickPlay(this.state.lastPlayedVideoItemId)(event);
            }
        });
        const editorItem = {
            startAt: 0,
            stopAt: 0
        };
        this.setState({
            video: [...video, editorItem]
        })
    }
    render() {
        const { video, playingVideoItemId } = this.state;
        const lastItemIndex = video.length - 1;
        return(
            <div className={styles.container}>
                <h1>Learn any language Tube</h1>
                <iframe id="player" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" width="640" height="390" src="https://www.youtube.com/embed/1uDsY9i2EbI?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1"></iframe>
                <Editor
                    {...video[lastItemIndex]}
                    handleOnInput={this.handleOnInput(lastItemIndex)}
                    handleOnClickPlay={this.handleOnClickPlay(lastItemIndex)}
                />
                {video.map(({ source }, index) => (
                    <TextBox
                        key={index}
                        text={source}
                        isActiveItem={playingVideoItemId === index}
                        onClick={this.handleOnClickPlay(index)}
                    />
                ))}
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
