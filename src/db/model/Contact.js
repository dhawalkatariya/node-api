const { DataTypes } = require("sequelize");
const { sequelize } = require("../connection");
const Employee = require('./Employee');

const Contact = sequelize.define('contact', {
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
}, { underscored: true });

Contact.belongsTo(Employee, {
    foreignKey: {
        allowNull: false
    }
});
Employee.hasMany(Contact, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = Contact;