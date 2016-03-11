/* Import "logic" dependencies first */
import React from 'react';
import RouteNotFound from '../RouteNotFound';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';

export default function requireAuthentication(Component, accessLevel) {
    class AuthenticatedView extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                authenticated: Boolean(this.props.user),
            };
        }

        componentWillMount() {
            this.setState({
                authenticated: this.checkAuth(this.props),
            });
        }

        componentWillReceiveProps(nextProps) {
            if (!this.checkAuth(nextProps)) {
                this.props.dispatch(
                    pushPath(`/`)
                );
            } else if (nextProps.user) {
                this.setState({
                    authenticated: this.checkAuth(nextProps),
                });
            }
        }

        checkAuth(props) {
            return !(
                !props.user
                || (
                    props.user.roles.indexOf(accessLevel) < 0
                    && props.user.roles.indexOf('SUPER_ADMIN') < 0
                )
            );
        }

        render() {
            console.log(this.state.authenticated);
            if (this.state.authenticated) {
                return <Component {...this.props}/>;
            } else {
                return (<RouteNotFound />);
            }
        }
    }

    return connect((reduxState) => ({
        user: reduxState.main.auth.user,
    }))(AuthenticatedView);
}
