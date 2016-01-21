/* Import "logic" dependencies first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';

/* Then React components */
import Page from '../../components/Page';
import Cover from '../../components/Cover';
import Layout34 from '../../components/Layout34';

/* Then view-related stuff */
export default class TeamProfile extends Component {
    componentWillMount() {
        document.title = 'TeamProfileNameHere | Raiserve';
    }

    render() {
        return (
            <Page>
                <Cover image={"url(/assets/images/team_cover.jpg)"}
                    customclass={"cover-profile"}
                    tagline={"I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    button={"Sponsor Now"}
                />
                <div className={"container main-content"}>
                    <Layout34 page={'teamprofile'}>
                        <h2>{'YOU + US'}<br/>{'= A WORLD OF CHANGE'}</h2>
                        <h3>{'How It Works.'}</h3>
                        <p>
                            {'I’ve Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat'}
                        </p>
                    </Layout34>
                </div>
            </Page>
        );
    }
}

TeamProfile.propTypes = {
    show: React.PropTypes.bool,
};
