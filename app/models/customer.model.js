module.exports = (sequelize, Sequelize) => {
  const Voter = sequelize.define("voter", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    age: {
      type: Sequelize.INTEGER,
    },
    Idnumber: {
      type: Sequelize.STRING,
    },
    Status: {
      type: Sequelize.STRING,
    },
    privatekey: {
      type: Sequelize.STRING,
    },

    accountaddress: {
      type: Sequelize.STRING,
    },
    mobile: {
      type: Sequelize.STRING,
    },
  });

  return Voter;
};
