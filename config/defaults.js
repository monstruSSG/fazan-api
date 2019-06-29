require('dotenv').config()

const config = {
    PORT: process.env.PORT || 3001,
    MONGO: {
        URI: process.env.MONGODB_URI || 'mongo'
    }
}

module.exports = config;