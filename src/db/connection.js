const Sequelize = require("sequelize");
const { config } = require('dotenv');
config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
    }
);

const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connected to DB');
    } catch (e) {
        console.error('Failed to connect to DB');
        console.error(e?.stack);
        throw e;
    }
}

module.exports = { sequelize, connectToDB }