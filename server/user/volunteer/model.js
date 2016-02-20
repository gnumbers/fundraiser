'use strict';
import neo4jDB from 'neo4j-simple';
import config from '../../config';
import { VOLUNTEER } from '../roles';

const db = neo4jDB(config.DB_URL);

import User from '../model';
import Hours from '../../hours/model';

export const volunteerSchema = {
    headshotData: db.Joi.object(),
    description: db.Joi.string(),
};

export default class Volunteer {
    constructor(data, teamSlug) {
        let volunteer;

        return new User(data, VOLUNTEER)
        .then((volunteerCreated) => {
            volunteer = volunteerCreated;
            return db.query(`
                MATCH (user:VOLUNTEER {id: {userId} }), (team:TEAM {slug: {teamSlug} })
                CREATE (user)-[:VOLUNTEER]->(team)
                `,
                {},
                {
                    userId: volunteer.id,
                    teamSlug,
                }
            );
        })
        .then((link) => {
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

    static insertIntoDb(obj) {
        console.log("insert vol started " + obj.email);

        return super.insertIntoDb(obj)
        .then((userSaved) => db.query(
            `
            MATCH (team:Team {short_name: {teamShortName} })

            MERGE (user:User {email: {email} })
            ON CREATE SET user.password = {password}, user.uuid = {uuid}, user.firstName = {firstName}, user.lastName = {lastName}, user.bio = {bio}

            MERGE (user)-[v:VOLUNTEER]->(team)
            ON CREATE SET v.projectStatement = {projectStatement}

            MERGE (headshot:Image)-[:HEADSHOT]->(user)
            ON CREATE SET headshot.key = {headshotImageKey}

            RETURN user
            `,
            {},
            userSaved
        )
        .getResult('user'));
    }

    static fetchByUuid(uuid) {
        return db.query(
            `
            MATCH (v:User {uuid: {volunteer_uuid}})<-[:HEADSHOT]-(img:Image)
            RETURN {
                firstName: v.firstName,
                lastName: v.lastName,
                imageURL: {baseURL} + img.key, bio: v.bio
            } as volunteer
            `,
            {},
            {
                volunteer_uuid: uuid,
                baseURL: config.S3_BASE_URL,
            }
        )
        .getResult('volunteer');
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
}
