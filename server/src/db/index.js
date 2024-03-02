const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yashwantdangi', 'yashwantdangi', null, {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize.sync()

const modelDefiners = [
    require('./models/user.model'),
    require('./models/message.model'),
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

module.exports = sequelize