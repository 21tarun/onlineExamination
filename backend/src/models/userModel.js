const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({


    email: {
        type: String,
        required: true,
        unique: true
    },

    userType: {
        type: String,
        enum: ['Student', 'Admin'],
        default: 'Student'
    }
    
})


module.exports = mongoose.model("user", userSchema)




