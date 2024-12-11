const mongoose = require('mongoose');


const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Db connected');

    } catch (error) {
        console.log('DataBase connection failed !' , error);
    }
}



module.exports = connectDB;