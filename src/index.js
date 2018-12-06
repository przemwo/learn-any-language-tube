import React from 'react';
import ReactDOM from 'react-dom';

import TextBox from './components/TextBox';
import Editor from './components/Editor';
import { video } from './data';

import * as styles from './styles.css';

const videoId = "n3kNlFMXslo";

const changeLastPlayedVideoItemIdBy = (change) => (prevState) => ({
    lastPlayedVideoItemId: prevState.lastPlayedVideoItemId + change
});

const editorItem = {
    startAt: 0,
    stopAt: 0
};

class YouTubePlayer extends React.Component {
    constructor() {
        super();
        this.state = {
            video: [...video, editorItem],
            playingVideoItemId: undefined,
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
        if (event.data === YT.PlayerState.PLAYING && !this.state.done) {
            let { startAt, stopAt } = this.state.video[this.state.playingVideoItemId];
            if(!stopAt) {
                const nextItemStartAt = this.state.video[this.state.playingVideoItemId + 1]['startAt'];
                stopAt = nextItemStartAt ? nextItemStartAt : 0;
            }
            const playDurationInSeconds = (startAt > stopAt) ? 0 : (stopAt - startAt);
            this.timeOutId = setTimeout(this.pauseVideo, playDurationInSeconds * 1000);
            this.setState({ done: true });
        }
        if(event.data === YT.PlayerState.PLAYING && !this.intervalId) {
            console.log('PLAY');
            this.intervalId = setInterval(() => {
                console.log(this.player.getCurrentTime().toFixed(2));
            }, 100);
        }
        if(event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.END) {
            console.log('STOP ', event.data);
            clearInterval(this.intervalId);
            this.intervalId = null;
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
        console.log("TIME: ", this.player.getCurrentTime());
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
    handleOnKeyUp = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const keyName = event.key;
        if (keyName === 'p') {
            this.handleOnClickPlay(this.state.lastPlayedVideoItemId)(event);
        } else if (keyName === '[') {
            const { lastPlayedVideoItemId } = this.state;
            if (lastPlayedVideoItemId > 0) {
                this.setState(
                    () => {
                        this.handleOnClickPlay(this.state.lastPlayedVideoItemId -1)(event);
                    }
                );
            }
        } else if (keyName === ']') {
            const { lastPlayedVideoItemId, video } = this.state;
            const lastItemId = video.length;
            if (lastPlayedVideoItemId < lastItemId) {
                this.setState(
                    changeLastPlayedVideoItemIdBy(1),
                    () => {
                        this.handleOnClickPlay(this.state.lastPlayedVideoItemId)(event);
                    }
                );
            }
        }
    }
    componentDidMount() {
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
        // Keybaord events
        document.addEventListener('keyup', this.handleOnKeyUp);
    }
    render() {
        const { video, playingVideoItemId, lastPlayedVideoItemId } = this.state;
        const lastItemIndex = video.length - 1;
        const lastItem = video.slice(-1);
        const items = video.slice(0, -1);
        return(
            <div className={styles.container}>
                <div>
                    <h1>Learn any language Tube</h1>
                    <iframe id="player" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" width="640" height="360" src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1`}></iframe>
                    <Editor
                        {...lastItem}
                        handleOnInput={this.handleOnInput(lastItemIndex)}
                        handleOnClickPlay={this.handleOnClickPlay(lastItemIndex)}
                    />
                </div>
                <div className={styles['text-boxes-containenr']}>
                    {items.map(({ source }, index) => (
                        <TextBox
                            key={index}
                            text={source}
                            isActiveItem={playingVideoItemId === index}
                            isCurrentItem={lastPlayedVideoItemId === index}
                            onClick={this.handleOnClickPlay(index)}
                        />
                    ))}
                </div>
            </div>
        );
    }
};

ReactDOM.render(
    <YouTubePlayer />,
    document.getElementById('app')
);

// TODO:
// Load this script dynamically
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const  firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
