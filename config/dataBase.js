const mongoose = require('mongoose');
const config = require('config');
const dbgr = require('debug')("development:mongoose");

const dbConnect = () => {
    mongoose.connect(`${config.get("MONGODB_URI")}/scatch`)
    .then(() => {
        dbgr("DataBase is connected successfully");
    })
    .catch((error) => {
        console.error('DB server error', error);
        process.exit(1);
    });
};

module.exports = dbConnect;
