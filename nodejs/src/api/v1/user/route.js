const express = require('express');
const userFacade = require('./facade');
const router = express.Router();


router.route('/profile')
    .get((req, res) =>
    userFacade.getProfile(req.session.userId)
            .then(response => res.done(response))
            .catch(err => res.err(err)))

module.exports = router