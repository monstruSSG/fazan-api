module.exports = {
    host: process.env.HOST || 'http://localhost',
    port: process.env.PORT || 9001,
    mongodb: process.env.MONGODB_URI || 'mongodb://mongo:27017/fazan_testing',
    testingUser: {
        username: 'test',
        password: 'test'
    }
}