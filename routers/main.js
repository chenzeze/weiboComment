// 定义接口
var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');

const limit = 4; //定义每页记录条数
//增加新评论
router.post('/', function (req, res) {
    var content = req.body.content;
    if (!content) {
        res.status(400).send("arg err").end();
    } else {
        var newComment = new Comment({
            content: content,
            time: new Date()
        });
        newComment.save();
        res.redirect('/');
    }
})
router.get('/get_comments', function (req, res) {
    // 解析url路径中query.act，根据其行为返回不同的数据
    var act = req.query.act;
    if (!act) {
        // 返回所有数据
        Comment.find().then(function (comments) {
            res.send(comments).end();
        })
    } else {
        switch (act) {
            case 'get_page_count':
                Comment.count().then(function (count) {
                    // 根据数据总条数和每页条数，计算总页数
                    var pages = Math.ceil(count / limit);
                    // 不能返回一个数字，会被当成status码，将其转换为string格式
                    // res.send(pages + '');
                    // 但这里需要将每页条数也返回回去,写成对象格式
                    // {
                    //     pages,
                    //     limit
                    // }
                    // 是es6的写法， 相当于
                    // {
                    //     pages: pages,
                    //     limit: limit
                    // }
                    // 当key 和value 名相同时可简写
                    res.send({
                        pages,
                        limit
                    });
                })
                break;
            case 'get':
                // 获取第二个参数page,当前页数
                var page = req.query.page;
                if (!page) {
                    res.status(400).send('arg error').end();
                } else {
                    // 获取跳过的条数
                    var skip = (page - 1) * limit;
                    Comment.find().sort({
                        time: -1
                    }).skip(skip).limit(limit).then(function (comments) {
                        res.send(comments).end();
                    });
                }
                break;
            case 'incLike':
                // 获取点赞的评论id
                var id = req.query.id;
                if (!id) {
                    res.status(400).send('arg error').end();
                } else {
                    // 找到对应的评论，对其like属性+1
                    Comment.findOne({
                        _id: id
                    }).then(function (comment) {
                        if (comment) {
                            Comment.updateOne({
                                _id: comment._id
                            }, {
                                like: comment.like + 1
                            }).then(function (err, docs) {
                                if (err)
                                    console.log(err);
                                console.log(docs);
                                res.send({
                                    error: 0
                                }).end();
                            })
                        }
                    })

                }
                break;
            case 'incUnlike':
                // 获取踩的评论id
                var id = req.query.id;
                if (!id) {
                    res.status(400).send('arg error').end();
                } else {
                    // 找到对应的评论，对其unlike属性+1
                    Comment.findOne({
                        _id: id
                    }).then(function (comment) {
                        if (comment) {
                            Comment.updateOne({
                                _id: comment._id
                            }, {
                                unlike: comment.unlike + 1
                            }).then(function (err, docs) {
                                if (err)
                                    console.log(err);
                                console.log(docs);
                                res.send({
                                    error: 0
                                }).end();
                            })
                        }
                    })

                }
                break;
        }
    }

})
module.exports = router;
/*
**********************************************
Author:	chenzeze
Date:	2018-10-13

usage:
post    提交到'/'
            提交成功后重定向到'/' 
            
        
get     /get_comments?act=get_page_count	获取页数
            返回：{pages:页数,limit:每页评论条数}
                 
        /get_comments?act=get&page=1		获取一页数据
            返回：[{_id: ID, content: "内容", time: 时间戳, like: 赞次数, unlike: 踩次数}, {...}, ...]
        
        /get_comments?act=incLike&id=65656565			顶某一条数据
            返回：{error:0}
        
        /get_comments?act=incUnlike&id=56454545			踩某一条数据
            返回：{error:0}


注意：	服务器所返回的时间戳都是秒（JS是毫秒）
**********************************************
*/