const express = require('express');
const userFacade = require('./facade');
const router = express.Router();


router.route('/')
    .get((req, res) => userFacade.getUsers({}, { from: Number(req.query.from), limit: Number(req.query.limit) })
        .then(response => res.done(response))
        .catch(err => res.err(err)))

router.route('/profile')
    .get((req, res) => userFacade.getProfile(req.userId)
        .then(response => res.done(response))
        .catch(err => res.err(err)))


module.exports = router