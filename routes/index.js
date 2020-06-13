var express = require('express');
var router = express.Router();
var moment = require('moment');
var mongdb = require('mongodb');
var db = require('monk')('localhost:27017/pin');


/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db
    var posts = db.get('post')
    var category = db.get('categories')
    var list
    category.find({}, {}, (err, data) => {
        list = data
    })
    posts.find({}, {}, (err, posts) => {
        res.render('home', {
            posts: posts,
            category: list,
            formatDate: function(date, format) {
                return moment(date).format("MM-DD-Y");
            },
            truncateText: function(text) {
                return text.fn(this).substring(0, 200)
            }

        })

    })

});

module.exports = router;