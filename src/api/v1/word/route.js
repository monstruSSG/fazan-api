const express = require('express');
const wordLogic = require('./logic');
const router = express.Router();


router.route('/check/:WORD')
    .get((req, res) =>
        wordLogic.check(req.params.WORD)
            .then(response => res.done(response))
            .catch(err => res.err(err)))

router.route('/')
    .get((_, res) =>
        wordLogic.find()
            .then(response => res.done(response))
            .catch(err => res.err(err)))

module.exports = router