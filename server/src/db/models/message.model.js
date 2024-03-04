const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "message",
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senderID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
};
