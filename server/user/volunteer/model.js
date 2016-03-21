'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { VOLUNTEER } from '../roles';
import slug from 'slug';
import util from '../../helpers/util';
import Mailer from '../../helpers/mailer';
import * as Urls from '../../../src/urls';
import * as Constants from '../../../src/common/constants';
const db = neo4jDB(config.DB_URL);

import User from '../model';
import Hours from '../../hours/model';

export const volunteerSchema = {
    slug: db.Joi.string(),
    image: db.Joi.string(),
    description: db.Joi.string(),
    goal: db.Joi.number(),
};

export default class Volunteer {
    constructor(data, teamSlug) {
        let volunteer;

        if (data.firstName && data.lastName && !data.slug) {
            data.slug = slug(`${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}`);
        }

        // Set default attributes to 0
        data.hourlyPledge = 0;
        data.totalSponsors = 0;
        data.currentHours = 0;
        data.totalHours = 0;
        data.raised = 0;

        return new User(data, VOLUNTEER)
        .then((volunteerCreated) => {
            volunteer = volunteerCreated;
            // Create relation and increment team volunteers number
            return db.query(`
                MATCH (user:VOLUNTEER {id: {userId} }), (team:TEAM {slug: {teamSlug} })
                SET team.totalVolunteers = team.totalVolunteers + 1
                CREATE (user)-[:VOLUNTEER]->(team)
                `,
                {},
                {
                    userId: volunteer.id,
                    teamSlug,
                }
            );
        })
        .then(() => {
            // Get welcome email data
            return Volunteer.getTeamAndProject(volunteer);
        })
        .then((result) => {
            // TODO EMAIL
            // Create and send email

            const subject = 'Welcome to Raiserve';

            const text =
            `${volunteer.firstName} ${volunteer.lastName},
            congrats on joining team ${result.team.name}. Your hour will now make twice the difference as you raise money for ${result.project.name}.
            Call to action is to Share Share Share.
            you can email this <a href="${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(result.project.slug, result.team.slug, volunteer.slug)}">${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(result.project.slug, result.team.slug, volunteer.slug)}</a>
            or post that link on facebook, twitter etc
            remember it takes a few tries to get people.. our best fundraise share and email potential sponsors every month with an update them after they volunteer
            Don’t forget to record your hours
            you can click here to get to your dashboard to record them
            `;

            const plainText =
            `${volunteer.firstName} ${volunteer.lastName},
            congrats on joining team ${result.team.name}. Your hour will now make twice the difference as you raise money for ${result.project.name}.
            Call to action is to Share Share Share.
            you can email this ${Constants.DOMAIN}/${Urls.getVolunteerProfileUrl(result.project.slug, result.team.slug, volunteer.slug)}
            or post that link on facebook, twitter etc
            remember it takes a few tries to get people.. our best fundraise share and email potential sponsors every month with an update them after they volunteer
            Don’t forget to record your hours
            you can click here to get to your dashboard to record them
            `;

            const message = {
                text: plainText,
                subject,
                to: [{
                    email: volunteer.email,
                    name: `${volunteer.firstName} ${volunteer.lastName}`,
                    type: 'to',
                }],
                global_merge_vars: [
                    {
                        name: 'headline',
                        content: subject,
                    },
                    {
                        name: 'message',
                        content: text,
                    },
                ],
            };

            Mailer.sendTemplate(message, 'mandrill-template');

            return Promise.resolve(volunteer);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    /* Logs hours to the db, uploads signature */
    static logHours(obj) {
        return Hours.validate(obj)
        .then(Hours.uploadSignature)
        .then(Hours.insertIntoDb)
        .catch((err) => {
            // handle error
        });
    }

    static getTeamAndProject(volunteer) {
        return db.query(`
            MATCH (project:PROJECT)<-[:CONTRIBUTE]-(team:TEAM)<-[:VOLUNTEER]-(:VOLUNTEER { id: {userId} })
            RETURN project, team
            `,
            {},
            {
                userId: volunteer.id,
            }
        ).getResult('project', 'team')
        .then((result) => {
            return Promise.resolve(result);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
    }

    static volunteeringForTeams(uuid) {
        return db.query(
            `
            MATCH (u:USER {uuid: {uuid}} )-[:VOLUNTEER]->(t:Team) return t
            `,
            {},
            { uuid }
        )
        .getResults('t');
    }

    static getBySlug(volunteerSlug) {
        return db.query(
            `
            MATCH (user:VOLUNTEER {slug: {volunteerSlug}})
            RETURN user
            `,
            {},
            { volunteerSlug }
        )
        .getResult('user');
    }

    static getVolunteers(projectSlug = null, teamSlug = null) {
        if (!teamSlug && projectSlug) {
            return db.query(
                `
                MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM)-[:CONTRIBUTE]->(:PROJECT {slug: {projectSlug}})
                RETURN users
                `,
                {},
                { projectSlug }
            ).getResults('users');
        } else if (teamSlug) {
            return db.query(
                `
                MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM {slug: {teamSlug}})
                RETURN users
                `,
                {},
                { teamSlug }
            ).getResults('users');
        }
        return db.query(
            `
            MATCH (users:VOLUNTEER)
            RETURN users
            `
        ).getResults('users');
    }

    static getVolunteersByIds(projectSlug = null, teamSlug = null, volunteersIds = null) {
        if (!teamSlug && projectSlug) {
            return db.query(
                `
                MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM)-[:CONTRIBUTE]->(:PROJECT {slug: {projectSlug}})
                WHERE users.id IN {volunteersIds}
                RETURN users
                `,
                {},
                {
                    projectSlug,
                    volunteersIds,
                }
            ).getResults('users');
        } else if (teamSlug) {
            return db.query(
                `
                MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM {slug: {teamSlug}})
                WHERE users.id IN {volunteersIds}
                RETURN users
                `,
                {},
                {
                    teamSlug,
                    volunteersIds,
                }
            ).getResults('users');
        }
        return db.query(
            `
            MATCH (users:VOLUNTEER)
            WHERE users.id IN {volunteersIds}
            RETURN users
            `,
            {},
            {
                volunteersIds,
            }
        ).getResults('users');
    }

    static getTopVolunteers(projectSlug = null, teamSlug = null) {
        return db.query(
            `
            MATCH (users:VOLUNTEER)-[:VOLUNTEER]->(:TEAM {slug: {teamSlug}})-[:CONTRIBUTE]->(:PROJECT {slug: {projectSlug}})
            WHERE exists(users.raised)
            RETURN users
            ORDER BY users.raised DESC
            LIMIT 5
            `,
            {},
            {
                projectSlug,
                teamSlug,
            }
        ).getResults('users');
    }

    static updateVolunteer(user) {
        if (typeof user.email !== 'undefined') {
            if (!util.isEmailValid(user.email)) {
                return Promise.reject('Invalid email');
            }
        }

        if (typeof user.goal !== 'undefined') {
            user.goal = parseInt(user.goal, 10);
            if (isNaN(user.goal) || user.goal < 0 || user.goal > 999) {
                return Promise.reject('Invalid goal');
            }
        }

        if (typeof user.roles !== 'undefined') {
            Reflect.deleteProperty(user, 'roles');
        }

        return new Promise((resolve, reject) => {
            const callUserUpdate = (uploadUrl) => {
                return User.update(user, {
                    ...(user.id ? { id: user.id } : {}),
                    ...(user.firstName ? { firstName: user.firstName } : {}),
                    ...(user.lastName ? { lastName: user.lastName } : {}),
                    ...(user.email ? { email: user.email } : {}),
                    ...(user.goal ? { goal: user.goal } : {}),
                    ...(user.password ? { password: user.password } : {}),
                    ...(user.roles ? { roles: user.roles } : {}),
                    ...(user.description ? { description: user.description } : {}),
                    ...(uploadUrl ? { image: uploadUrl } : {}),
                    ...(user.slug ? { slug: user.slug } : {}),
                    ...(user.totalHours ? { totalHours: user.totalHours } : {}),
                    ...(user.currentHours ? { currentHours: user.currentHours } : {}),
                }).then((data) => {
                    return resolve(data);
                }).catch((error) => {
                    return reject(error);
                });
            };

            if (typeof user.image !== 'undefined') {
                return Volunteer.uploadHeadshot({
                    id: user.id,
                    image: user.image,
                }).then((uploadUrl) => {
                    return callUserUpdate(uploadUrl);
                }).catch((error) => {
                    return reject(error);
                });
            }
            return callUserUpdate();
        });
    }

    static uploadHeadshot(obj) {
        const key = `users/${obj.id}.png`;

        return new Promise((resolve, reject) => {
            util.uploadToS3(
                obj.image,
                key,
                { contentType: 'base64' },
                (err, res) => {
                    if (err) {
                        reject(`Unable to upload signature: ${err}`);
                    } else {
                        resolve(`${config.S3.BASE_URL}/${key}`);
                    }
                }
            );
        });
    }

    static onboard(obj) {
        return Volunteer.create(obj)
        .then((newVolunteer) => db.query(`
                MATCH (team:Team {short_name: {teamShortName} })
                MATCH (user:User {email: {email} })

                MERGE (user)-[volunteerism:VOLUNTEER]->(team)
                ON CREATE SET volunteerism.goal = {goal}

                RETURN user
                `,
                {},
                newVolunteer
            )
            .getResult('user'));
    }

    static fetchSponsors(uuid) {
        return db.query(`
            MATCH (u:User)-[:PLEDGED]->(p:Pledge)<-[:RAISED]->(volunteer:User {uuid: {uuid} })
            RETURN {
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                amount: p.amountPerHour,
                maxPerMonth: p.maxPerMonth
            } as pledges
            `,
            {},
            { uuid }
        )
        .getResults('pledges');
    }

    static resetCurrentHours() {
        return db.query(`
            MATCH (volunteer:VOLUNTEER)
            SET volunteer.currentHours = 0
            RETURN volunteer as volunteers
            `,
        )
        .getResults('volunteers')
        .then(() => {
            console.log('Volunteers current hours successfully reseted!');
        })
        .catch((err) => {
            console.log('Reset current hours failed:', err);
        })
    }
}
