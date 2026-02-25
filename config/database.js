require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('MongoDB connection error', err));
module.exports = mongoose;





