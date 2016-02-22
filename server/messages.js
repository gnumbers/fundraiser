'use strict';
export default {
    login: {
        success: 'Login successful',
        failed: 'Invalid login credentials',
    },
    logout: 'Logout successful',
    resetPassword: {
        success: 'The email has been sent',
        failed: 'Sorry, there has been an error',
    },
    project: {
        required: 'Please fill all required fields and verify that the Project slug is valid and not taken already',
    },
    team: {
        required: 'Please fill all required fields and verify that the Team slug is unique and valid',
    },
    invite: {
        volunteerOk: 'The new Volunteer has been invited successfully!',
        teamLeaderOk: 'The new Team Leader has been invited successfully!',
        projectLeaderOk: 'The new Project Leader has been invited successfully!',
        error: 'Sorry, the email you entered is either invalid or the user is already part of a Team or Project.',
    },
};
