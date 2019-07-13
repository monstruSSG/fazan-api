module.exports = {
    apps: [
        {
            name: 'fazan-api',
            script: 'app.js',
            watch: true,
            "watch_options": {
                usePolling: true
            },
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            }
        }
    ]
};