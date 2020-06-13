var express = require('express');
var router = express.Router();
var mongdb = require('mongodb');
var db = require('monk')('localhost:27017/pin');


/* GET home page. */
router.get('/add', function(req, res, next) {
    res.render('categories', {
        title: "Add categories"

    })

});
router.post('/add', function(req, res, next) {
    var title = req.body.title
    req.checkBody('title', 'Title is required').notEmpty()
    var errors = req.validationErrors();
    if (errors) {
        res.render('categories', {
            errors: errors
        })
    } else {
        var post = db.get('categories')
        post.insert({
            "title": title
        }, (err, data) => {
            if (err) {
                res.end('Error submitting')
            }
            req.flash('success', 'file submitted')
            res.location('/')
            res.redirect('/')
        })
    }

});
// render page category
router.get('/:name', (req, res, next) => {
    var category = db.get('post')
    category.find({ 'category': req.params.name }, (err, data) => {
        if (err) {
            res.render('404')
        } else {
            res.render('page', {
                "data": data,
                "title": req.params.name
            })
        }
    })
})
module.exports = router;