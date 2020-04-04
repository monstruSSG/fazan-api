const express = require('express')
const authLogic = require('./logic')
const router = express.Router()


router.route('/login/fb')
    .post((req, res) =>
        authLogic.fbLogin(req.body)
            .then(response => res.done(response))
            .catch(err => res.err(err)))

router.route('/login/gmail')
    .post((req, res) =>
        authLogic.gmailLogin(req.body)
            .then(response => res.done(response))
            .catch(err => res.err(err)))

router.route('/register')
    .post((req, res) =>
        authLogic.register(req.body.user)
            .then(response => res.done(response))
            .catch(err => res.err(err)))

module.exports = router 
