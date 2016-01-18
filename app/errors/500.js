module.exports = function (app) {
    /**
     * In development render full error page with content of error
     */
    if (app.locals.ENV_DEVELOPMENT) {
        app.use(function(err, req, res, next) { //eslint-disable-line no-unused-vars
            // TODO needs implementation
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }

    /**
     * In production just return a basic error page without any server information.
     * Likely a static file or something that require very little as there might be something very wrong.
     */
    app.use(function(err, req, res, next) { //eslint-disable-line no-unused-vars
        // TODO needs implementation
        res.status(err.status || 500);
        res.render('error', {
            message: 'no server info here. just an excuse',
            error: {},
            title: 'error'
        });
    });
};