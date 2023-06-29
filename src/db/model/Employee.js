const DataTypes = require("sequelize");
const { sequelize } = require("../connection");

const Employee = sequelize.define('employee', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jobTitle: DataTypes.STRING,
    primaryContactName: DataTypes.STRING,
    primaryContactPhone: DataTypes.STRING,
    primaryContactRelation: DataTypes.STRING,
    secondaryContactName: DataTypes.STRING,
    secondaryContactPhone: DataTypes.STRING,
    secondaryContactRelation: DataTypes.STRING,
}, { underscored: true });

module.exports = Employee;