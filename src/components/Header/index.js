import React, { Component } from 'react';
import Button from '../Button/';
import Menu from '../Menu/';
import * as Urls from '../../urls.js';
import { Link } from 'react-router';

export default class Header extends Component {
    render() {
        // TODO address microformat

        return (
            <header>
                <div className="container">
                    <Link to={Urls.HOME}>
                        <img src="/assets/images/raiserve_logo.png"
                            id="logo"
                            title=""
                            alt=""
                        />
                    </Link>
                    <Menu/>
                </div>
            </header>
        );
    }
}
