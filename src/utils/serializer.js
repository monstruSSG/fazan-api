module.exports = function (promise, res) {
    let done = response => res.done(response);
    let error = err => res.err(err);

    if (promise) return promise
        .then(response => res.done(response))
        .catch(err => res.err(err));
    else { done, err };
}