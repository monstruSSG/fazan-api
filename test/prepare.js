//start server / overwrite dev environments
const config = require('./config')
process.env.PORT = config.port;
process.env.MONGODB_URI = config.mongodb;
const mongoose = require('mongoose');
const app = require('../app');
const wordLogic = require('../src/api/v1/word/logic');
const authLogic = require('../src/api/v1/auth/logic');

//ensure server starts before testing
before(done => {
    console.log('Start server with testing env');
    app.on('appStarted', async () => {
        console.log('Server started');
        try {
            await mongoose.connection.db.dropDatabase();
            console.log('Testing database dropped');

            console.log('Populate database with words');
            let wordsToInsertInDb = [
                'aalenian', 'aba', 'abac', 'abaca', 'abaca',
                'abager', 'abagerie', 'abagiu', 'abajur', 'abandon',
                'abandonare', 'abanos', 'abataj', 'abate'
            ];
            let wordsJsonMap = wordsToInsertInDb.map(word => ({ word }));
            await wordLogic.createMany(wordsJsonMap);

            console.log('Create testing user');
            await authLogic.register(config.testingUser);
            done();
        } catch (err) {
            throw err;
        }
    });
});
