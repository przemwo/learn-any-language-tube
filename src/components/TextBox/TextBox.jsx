import React from 'react';

import classNames from 'classnames';

import styles from './styles.css';

class TextBox extends React.Component {
    currentDOMElement;
    componentDidUpdate(prevProps) {
        if(!prevProps.isCurrentItem && this.props.isCurrentItem) {
            console.log('jest current!', this.props.text);
            this.currentDOMElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }
    render() {
        const { text, isActiveItem, isCurrentItem, onClick } = this.props;
        const container = classNames({
            [styles.container]: true,
            [styles.isActive]: isActiveItem,
            [styles.isCurrentItem]: isCurrentItem
        });
        return(
            <div
                ref={(element) => {this.currentDOMElement = element}}
                className={container}
                onClick={onClick}
            >
                <span>{text}</span>
            </div>
        );
    }
}
export default TextBox;