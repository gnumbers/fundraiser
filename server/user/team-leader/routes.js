'use strict';
import UserController from '../controller';

router.post('/api/v1/teamLeader/invite', (req, res) => {
    return UserController.invite(req.body.email)
    .then((user) => {
        if (user) {
            res.status(200).send(messages.invite.volunteerOk);
        }
        res.status(500).send(messages.invite.error);
    })
    .catch((err) => {
        res.status(500).send(messages.invite.error);
    });
});
