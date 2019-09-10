const express = require('express');
const authLogic = require('./logic');
const router = express.Router();


router.route('/login')
    .post((req, res) =>
        authLogic.login(req.body)
            .then(response => res.done(response))
            .catch(err => res.err(err)))

router.route('/register')
    .post((req, res) =>
        authLogic.register(req.body.user)
            .then(response => res.done(response))
            .catch(err => res.err(err)))

module.exports = router 