const config = require('config');
const mongoose = require('mongoose');

module.exports = function connectDB() {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    mongoose.connect('mongodb+srv://invo:' + config.get('mongo_pass') + '@cluster0-zkcca.mongodb.net/hisaab')
    .then(() => {
        console.log('Database Connected');
    })
    .catch(() => {
        console.log('Database connection failed');
    });
}