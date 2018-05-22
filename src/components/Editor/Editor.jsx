import React from 'react';

class Editor extends React.Component {
    render() {
        const { startAt, stopAt, handleOnInput, handleOnClickPlay } = this.props;
        return(
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
                <button
                    onClick={handleOnClickPlay}
                >
                    Play (P)
                </button>
            </div>
        );
    }
}
export default Editor;