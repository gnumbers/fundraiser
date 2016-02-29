/* Import "logic" dependencies first */
import React, { Component } from 'react';
import * as Actions from '../../../redux/sponsor/actions';
import { connect } from 'react-redux';
/* Then React components */
import AuthenticatedView from '../AuthenticatedView';
import AdminSponsorsTable from '../../../components/AdminSponsorsTable';
import AdminLayout from '../../../components/AdminLayout';
import AdminContentHeader from '../../../components/AdminContentHeader';

// TODO dynamic data
import * as data from '../../../common/test-data';
const sponsors = data.sponsors;

class AdminSponsors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sponsors: [],
        };
    }

    componentWillMount() {
        document.title = 'Sponsors | Raiserve';

        if (this.props.user) {
            Actions.indexSponsors()(this.props.dispatch);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({ error: nextProps.error });
        } else if (nextProps.sponsors) {
            this.setState(
                {
                    sponsors: nextProps.sponsors,
                    error: null,
                }
            );
        } else if (nextProps.user) {
            Actions.indexSponsors()(this.props.dispatch);

            this.setState(
                {
                    user: nextProps.user,
                    error: null,
                }
            );
        }
    }

    render() {
        if (!this.props.user) {
            return (null);
        }

        let header = null;

        if (this.props.user.role === 'PROJECT_LEADER') {
            header = `${this.props.user.project.name} Sponsors`;
        } else {
            header = `Sponsors`;
        }

        return (
            <AuthenticatedView accessLevel={'PROJECT_LEADER'}>
                <AdminLayout>
                    <AdminContentHeader title={header}
                        description={'Keep an eye on everyone on your team and watch their individual progress grow.'}
                    />
                    <AdminSponsorsTable sponsors={this.state.sponsors} />
                </AdminLayout>
            </AuthenticatedView>
        );
    }
}

AdminSponsors.propTypes = {
    show: React.PropTypes.bool,
};

export default connect((reduxState) => ({
    user: reduxState.main.auth.user,
    error: reduxState.main.sponsor.error,
    sponsors: reduxState.main.sponsor.sponsors,
}))(AdminSponsors);
