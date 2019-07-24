const express = require('express');
const wordLogic = require('./logic');
const router = express.Router();

const config = require('../../../../config/defaults')


router.route('/check/:WORD')
    .get((req, res) =>
        wordLogic.check(req.params.WORD)
            .then(response => res.done(response))
            .catch(err => res.err(err)))

router.route('/')
    .get((req, res) =>
        wordLogic.find({
            from: Number(req.query.from) || config.queryFrom,
            limit: Number(req.query.limit) || config.queryLimit
        })
            .then(response => res.done(response))
            .catch(err => res.err(err)))

module.exports = router