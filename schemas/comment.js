var mongoose = require('mongoose');

//创建一个schema，类似于sql的字段
module.exports = new mongoose.Schema({
    content: String,
    time: Date,
    like: {
        type: Number,
        default: 0
    },
    unlike: {
        type: Number,
        default: 0
    }
})