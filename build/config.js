let path = require('path');

module.exports = {
    dev: {
        env: {
            NODE_ENV: '"development"',
            baseURL: '"https://miniapp.gorkor.com/"'
        }
    },
    prod: {
        env: {
            NODE_ENV: '"production"',
            baseURL: '"https://miniapp.gorkor.com/"'
        }
    }
};