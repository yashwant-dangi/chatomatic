const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yashwantdangi', 'yashwantdangi', null, {
    host: 'localhost',
    dialect: 'postgres'
});

const modelDefiners = [
    require('./models/user.model'),
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

module.exports = sequelize