const mongoose = require("mongoose");

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(" DB connected");
    } catch (error) {
        console.log("DB connection failed:", error);
        throw error
        
    }
}

module.exports = connectDb;

