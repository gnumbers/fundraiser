/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import Button from '../../../components/Button';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';
import RecordHoursForm from '../../../components/RecordHoursForm';
import Dropzone from 'react-dropzone';
import * as Actions from '../../../redux/volunteer/actions';

import * as constants from '../../../common/constants';
import * as Urls from '../../../urls.js';
// TODO dynamic data
import * as data from '../../../common/test-data';

export default class AdminVolunteerProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
        };
    }

    componentWillMount() {
        document.title = 'My profile | Raiserve';
    }

    componentWillReceiveProps(nextProps) {
        console.log('Next Props', nextProps);
        if (nextProps.user) {
            console.log('User', nextProps.user);
            this.setState({
                user: nextProps.user,
            });
        }

        if (nextProps.volunteerUpdateStatus) {
            this.setState({
                volunteerUpdateStatus: nextProps.volunteerUpdateStatus,
            });

            if (nextProps.volunteerUpdateStatus) {
                transitionTo(`${Urls.VOLUNTEER_PROFILE}`);
            }
        }
    }

    onDrop = (files) => {
        const user = this.state.user;

        if (!user.password || user.password !== user.password2) {
            Reflect.deleteProperty(user, 'password');
        }

        Reflect.deleteProperty(user, 'password2');

        user.image = files[0];
        this.setState({
            user,
        });
    };

    submitProfile = () => {
        Actions.updateProfile(this.state.user)(this.props.dispatch);
    }

    getUserFirstName = () => {
        if (this.state.user && this.state.user.firstName) {
            return this.state.user.firstName;
        }
    }

    getUserLastName = () => {
        if (this.state.user && this.state.user.lastName) {
            return this.state.user.lastName;
        }
    }

    getUserEmail = () => {
        if (this.state.user && this.state.user.email) {
            return this.state.user.email;
        }
    }

    getUserLocation = () => {
        if (this.state.user && this.state.user.location) {
            return this.state.user.location;
        }
    }

    getUserMessage = () => {
        if (this.state.user && this.state.user.description) {
            return this.state.user.description;
        }
    }

    getUserGoal = () => {
        if (this.state.user && this.state.user.goal) {
            return this.state.user.goal;
        }
    }

    getUserId = () => {
        if (this.state.user && this.state.user.id) {
            return this.state.user.id;
        }
    }

    getUserImage = () => {
        if (this.state.user && this.state.user.preview) {
            return this.state.user.preview;
        }
    }

    getUserPreview = () => {
        if (this.state.user) {
            if (this.getUserImage()) {
                return `${constants.USER_IMAGES_FOLDER}/${this.getUserId()}/${this.getUserImage()}`;
            } else {
                return `${constants.USER_IMAGES_FOLDER}/${constants.DEFAULT_AVATAR}`;
            }
        }
    }

    getSuccessMessage = () => {
        return (<div className="success-message">Profile updated!</div>);
    }

    getErrorMessage = () => {
        return (<div className="error-message">Error in the form!</div>);
    }

    handleChange = (evt, name) => {
        const user = this.state.user;

        user[name] = evt.target.value;
        this.setState({
            user,
        });
    };

    render() {
        if (!this.state.user) {
            return null;
        }
        const pageNav = [
            {
                type: 'button',
                title: 'Record my hours',
                content: <RecordHoursForm/>,
            },
            {
                type: 'link',
                title: 'My Public Page',
                href: `${Urls.getVolunteerProfileUrl(data.project.slug, data.team.slug, data.volunteer.slug)}`,
            },
            {
                type: 'link',
                title: 'Edit Profile',
                href: `${Urls.ADMIN_VOLUNTEER_PROFILE_URL}`,
            },
        ];

        return (
            <AuthenticatedView accessLevel={'VOLUNTEER'}>
                <AdminLayout pageNav={pageNav}>
                    <AdminContentHeader
                        title={'My Profile'}
                        description={'THE LAST STEP. A simple but important step to keep your public page up-to-date & fresh.'}
                    />
                    <div className="edit-volunteer-profile">
                        <section className="form-container">
                            <form className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <input type="text"
                                        name="firstName"
                                        id="firstName"
                                        defaultValue={this.getUserFirstName() ? this.getUserFirstName() : null}
                                        onChange={(e) => { this.handleChange(e, 'firstName') }}
                                    />
                                    <label htmlFor="firstName">{'Firstname'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        name="lastName"
                                        id="lastName"
                                        defaultValue={this.getUserLastName() ? this.getUserLastName() : null}
                                        onChange={(e) => { this.handleChange(e, 'lastName') }}
                                    />
                                    <label htmlFor="lastName">{'Lastname'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        name="location"
                                        id="location"
                                        defaultValue={this.getUserLocation()}
                                        onChange={(e) => { this.handleChange(e, 'location') }}
                                    />
                                    <label htmlFor="zipcode">{'Zip Code'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="email"
                                        name="email"
                                        id="email"
                                        defaultValue={this.getUserEmail() ? this.getUserEmail() : null}
                                        onChange={(e) => { this.handleChange(e, 'email') }}
                                    />
                                    <label htmlFor="email">{'Email address'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        name="new-password"
                                        id="new-password"
                                        onChange={(e) => { this.handleChange(e, 'password') }}
                                    />
                                    <label htmlFor="new-password">{'New Password'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        name="new-password-confirmation"
                                        id="new-password-confirmation"
                                        onChange={(e) => { this.handleChange(e, 'password2') }}
                                    />
                                    <label htmlFor="new-password-confirmation">{'New Password Confirmation'}</label>
                                </div>
                                <div className="dropzone form-group">
                                    <Dropzone
                                        onDrop={this.onDrop}
                                        multiple={false}
                                        style={{ }}
                                    >
                                        <img
                                            className={"dropzone-image"}
                                            src={this.getUserPreview()}
                                        />
                                        <p className={"dropzone-text"}>{'Upload profile photo'}</p>
                                    </Dropzone>
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="description"
                                        id="description"
                                        placeholder="Why You're Volunteering, Why this matters to you. Be inspiring as this will engage people to sponsor you."
                                        defaultValue={this.getUserMessage()}
                                        rows="3"
                                        onChange={(e) => { this.handleChange(e, 'description') }}
                                    />
                                    <label htmlFor="description">{'Description'}</label>
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        name="goal"
                                        id="goal"
                                        defaultValue={this.getUserGoal()}
                                        onChange={(e) => { this.handleChange(e, 'goal') }}
                                    />
                                    <label htmlFor="goal">{'Goal Hours'}<span className={'lowercase'}>{' Be conservative, you can always add another goal in the future.'}</span></label>
                                </div>
                                <Button customClass="btn-green-white" onClick={this.submitProfile}>{'Save'}</Button> {this.state.volunteerUpdateStatus === false && this.getErrorMessage()}
                                {this.state.volunteerUpdateStatus === true && this.getSuccessMessage()}
                            </form>
                        </section>
                    </div>
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    volunteerUpdateStatus: reduxState.main.volunteer.volunteerUpdateStatus,
}))(AdminVolunteerProfile);
