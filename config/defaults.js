require('dotenv').config()

const config = {
    PORT: process.env.PORT,
    MONGO: {
        URI: process.env.MONGODB_URI
    }
}

module.exports = config;