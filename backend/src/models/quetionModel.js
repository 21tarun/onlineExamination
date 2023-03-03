const mongoose = require("mongoose")


const quetionSchema = new mongoose.Schema({


    quetion: {
        type: String,
        required: true
    },

    options: {
        type: [String],
        requied: true
    },
    answer: {
        type: String,
        requied:true
    },
    file:{
        type:String
    }

})


module.exports = mongoose.model("quetion", quetionSchema)




