import React, { Component } from 'react';

import styles from './footer.scss';

export default class Footer extends Component {
    render() {
        return (
            <footer>
                {'Footer'}
                <div className={'social'}>{'FB TW'}</div>
            </footer>
        );
    }
}
