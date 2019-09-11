const express = require('express');
const userFacade = require('./facade');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.route('/')
    .get((req, res) => {
        return userFacade.getUsers({}, { from: Number(req.query.from), limit: Number(req.query.limit) })
            .then(response => res.done(response))
            .catch(err => res.err(err))
    })

router.route('/profile')
    .get((req, res) => userFacade.getProfile(jwt.decode(req.headers.authorization))
        .then(response => res.done(response))
        .catch(err => res.err(err)))


module.exports = router