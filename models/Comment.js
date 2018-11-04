var commentSchema = require('../schemas/comment');
var mongoose = require('mongoose');

// 创建一个模型
// Comment 为 创建的 collections(集合，相当于关系型数据库中的表) 的名字,默认小写并且自动加s，即名字为comments
module.exports = mongoose.model('Comment', commentSchema);