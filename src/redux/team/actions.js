import * as actionTypes from './action-types';
import axios from 'axios';
import { API_URL } from '../../common/constants';

export const receivedTeam = (team) => ({
    type: actionTypes.NEW_TEAM,
    team,
});

export const newTeamFailed = (error) => ({
    type: actionTypes.NEW_TEAM_FAIL,
    error,
});

export function newTeam(name, slug, teamLeaderEmail) {
    return (dispatch) => {
        return axios.post(`${API_URL}/team`, {
            name,
            slug,
            teamLeaderEmail,
        })
        .then(
            (response) => {
                dispatch(receivedTeam(response.data));
            }
        )
        .catch(
            (errorResponse) => {
                dispatch(newTeamFailed(errorResponse.data));
            }
        );
    };
}
