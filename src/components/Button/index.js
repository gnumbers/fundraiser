import React, { Component } from 'react';

export default class Button extends Component {
    render() {
        return (
            <button
                type="button"
                className="btn btn-default"
            >
                {this.props.children}
            </button>
        );
    }
}
