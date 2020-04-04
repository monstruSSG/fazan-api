const admin = require('firebase-admin')
const path = require('path')

var serviceAccount = require(path.join(__dirname, '..', '..', 'config', 'firebase-conf.json'))

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = (deviceIdArr, payload) => admin.messaging().sendMulticast({ data: payload, tokens: deviceIdArr })
    .then(response => {
        if (response.failureCount > 0) {
            const failedTokens = []

            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(registrationTokens[idx]);
                }
            })
            console.error(`List of devices failed to send notification: ${JSON.stringify(failedTokens)}`)
        }
    })
    .catch(console.error)