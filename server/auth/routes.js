'use strict';
const express = require('express');
const util = require('../helpers/util');
const messages = require('../messages');
const router = express.Router();

const userController = require('../user/controller');

router.post('/api/v1/auth/login', (req, res) => {
    if (!req.body.password || !req.body.email) {
        res.status(401).send(messages.login.failed);
        return;
    }

    const credentials = {
        email: req.body.email,
        password: util.hash(req.body.password),
    };

    userController.checkCredentials(credentials)
    .then((user) => {
        console.log(`Credentials passed got uuid: ${user.uuid}`);
        req.session.user = user;

        res.status(200).send(userController.safe(user));
    })
    .catch((err) => {
        console.error(`Credentials failed: ${err}`);

        req.session.userUUID = null;
        res.status(401).send(err);
    });
});

router.get('/api/v1/auth/whoami', (req, res) => {
    if (req.session.user) {
        res.send(userController.safe(req.session.user));
    } else {
        res.status(404).send();
    }
});

router.get('/api/v1/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Couldnt destroy session');
        }
    });
    res.status(200).send(messages.logout);
});

router.post('/api/v1/auth/reset_password', (req, res) => {
    userController.resetPassword(req.body.email)
    .then((token) => {
        res.status(200).send(messages.resetPassword.success);
    })
    .catch((err) => {
        res.status(500).send(`${messages.resetPassword.error}: ${err}`);
    });
});

module.exports = router;
