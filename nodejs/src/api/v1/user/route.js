const express = require('express')
const userFacade = require('./facade')
const router = express.Router()


router.route('/')
    .get((req, res) => userFacade.getConnected({
        from: Number(req.query.from) || 0,
        limit: Number(req.query.limit) || 10,
        search: req.query.search || ''
    },
        req.userId)
        .then(response => res.done(response))
        .catch(err => res.err(err)))

router.route('/profile')
    .get((req, res) => userFacade.getProfile(req.userId)
        .then(response => res.done(response))
        .catch(err => res.err(err)))

router.route('/leaderboard')
    .get((_, res) => userFacade.getLeaderboard()
        .then(res.send)
        .catch(res.err))


module.exports = router