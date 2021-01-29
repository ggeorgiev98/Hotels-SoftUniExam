module.exports = {
    development: {
        port: process.env.PORT || 3000,
        privateKey: process.env.PRIVATE_KEY,
        databaseUrl: process.env.DATABASE_URL
    },
    production: {}
};