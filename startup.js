import config from 'config';
import mongoose from 'mongoose';

export default function connectDB() {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    try {
        const pass = config.get('mongo_pass');
        mongoose.connect('mongodb+srv://invo:' + pass + '@cluster0-zkcca.mongodb.net/hisaab')
        .then(() => {
            console.log('Database Connected');
        })
        .catch((err) => {
            console.log(err);
            console.log('Database connection failed');
            process.exit(1);
        });
    }
    catch(err) {
        console.log(err);
        console.log("Password for database not set!");
        process.exit(1);
    }
}