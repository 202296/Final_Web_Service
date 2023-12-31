const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
        console.log(mongoose.connection.name); // Check the current database name

    } catch (error) {
        console.error('Database connection error:', error);

    }
};

module.exports = dbConnect;