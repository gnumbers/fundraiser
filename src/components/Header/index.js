import React, { Component } from 'react';

import styles from './header.scss';

export default class Header extends Component {
    render() {
        return (
            <header>
                <div className="container">
                    <a href="#">
                        <img src="/images/raiserve_logo.png"
                            id="logo"
                            title=""
                            alt=""
                        />
                    </a>
                    <nav>
                        <ul className={"nav navbar-nav"}>
                            <li>
                                <a href="#"
                                    title=""
                                >
                                    {'What is Raiserve?'}
                                </a>
                            </li>
                            <li className="social">
                                <a href="#"
                                    title=""
                                >
                                    {'How Raiserve works'}
                                </a>
                            </li>
                            <li className={styles.social}>
                                <a href="#">
                                    <i className="fa fa-facebook"></i>
                                </a>
                            </li>
                            <li className={styles.social}>
                                <a href="#">
                                    <i className="fa fa-twitter"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}
