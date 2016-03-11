'use strict';
import express from 'express';
const router = express.Router();
import * as AUTH_CHECKER from '../auth/auth-checker';
import hoursController from './controller';
import UserController from '../user/controller';

router.post('/api/v1/hours', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isVolunteer(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    const hour = {
        hours: req.body.hours,
        signatureData: req.body.signature,
        place: req.body.place,
        date: req.body.date,
        supervisorName: req.body.supervisor,
        approved: req.body.approved,
    };

    hoursController.log(req.session.user.id, hour).then((result) => {
        res.status(200).send(result);
        return;
    }).catch((err) => {
        res.status(400).send(err);
        return;
    });
});

router.get('/api/v1/hours', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session)
        || !AUTH_CHECKER.isVolunteer(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    UserController.getUserWithHours(req.session.user.id).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

router.post('/api/v1/hours/:id', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session) ||
        !AUTH_CHECKER.isTeamLeader(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    hoursController.approve(req.params.id)
        .then(() => {
            res.status(200).send();
        })
        .catch(() => {
            res.status(400).send(err);
        });
});
router.get('/api/v1/hours-team/:teamid', (req, res) => {
    if (
        !AUTH_CHECKER.isLogged(req.session) ||
        !AUTH_CHECKER.isTeamLeader(req.session.user)
    ) {
        res.status(404).send();
        return;
    }

    const teamId = req.params.teamid;

    UserController.userOwnsTeam(req.session.user.id, teamId)
        .then((isUserOwningTeam) => {
            if (!isUserOwningTeam) {
                res.status(403).send(err);
                return;
            }
            hoursController.getHoursNotApproved(
                teamId,
            ).then((result) => {
                res.status(200).send(result);
            }).catch((err) => {
                res.status(400).send(err);
            });
        })
        .catch(() => {
            res.status(403).send(err);
        });
});

module.exports = router;
