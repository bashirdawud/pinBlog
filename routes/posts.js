var express = require('express');
var router = express.Router();
var multer = require('multer')
var path = require('path')
var mongdb = require('mongodb');
var db = require('monk')('localhost:27017/pin');

/* display post form. */
router.get('/add', function(req, res, next) {
    var categories = db.get('categories')
    categories.find({}, {}, (err, data) => {
        res.render('addpost', {
            'categories': data
        });
    })
});
//var uploads = multer({ dest: './public/images/uploads' })
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(res.end('Only images are allowed'), null)
        }
        callback(null, true)
    }
}).single('mainimage');

router.post('/add', upload, function(req, res) {

    var title = req.body.title
    var category = req.body.category
    var body = req.body.body
    var author = req.body.author
    var date = new Date();
    if (!req.file.filename) {
        var mainimage = 'noimage.png'
    } else {
        var mainimage = req.file.filename
    }

    req.checkBody('title', 'title is required').notEmpty()
    req.checkBody('body', 'body is required').notEmpty()
    req.checkBody('body', 'body is required').notEmpty()


    var errors = req.validationErrors();
    if (errors) {
        res.render('addpost', {
            "errors": errors,
            "title": title,
            "body": body
        })
    } else {
        var posts = db.get('post')
        posts.insert({
            "title": title,
            "body": body,
            "author": author,
            "category": category,
            "imagename": mainimage,
            "date": date
        }, (err, data) => {
            if (err) {
                res.send('Error submitting file')
            };
            req.flash('success', 'post submitted')
            res.location('/')
            res.redirect('/')
        })
        res.redirect('/')
    }
})

/* single post handler */
router.get('/:id', function(req, res, next) {
    var posts = db.get('post')
    console.log(req.params.id)
    posts.find({ '_id': req.params.id }, {}, (err, data) => {
        if (err) { throw err }
        res.render('single', {
            'post': data,
            'title': data[0].title

        });

    })

});

module.exports = router;