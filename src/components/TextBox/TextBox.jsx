import React from 'react';

import classNames from 'classnames';

import styles from './styles.css';

class TextBox extends React.Component {
    render() {
        const { text, isActiveItem, onClick } = this.props;
        const container = classNames({
            [styles.container]: true,
            [styles.isActive]: isActiveItem
        });
        return(
            <div
                className={container}
                onClick={onClick}
            >
                <span>{text}</span>
            </div>
        );
    }
}
export default TextBox;