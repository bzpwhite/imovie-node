var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var fs = require('fs');
var path = require('path');

var _ = require('underscore');
/*后台登陆页*/
exports.new = function (req,res) {
    Category.find({},function (err,categories) {
        res.render('admin',{
            title:'imooc 后台录入页',
            categories:categories,
            movie: {
                // title:'',
                // doctor:'',
                // country:'',
                // year:'',
                // poster:'',
                // flash:'',
                // summary:'',
                // language:''
            }
        })
    })
}
/*admin update movie*/
exports.update = function (req,res) {
    var id = req.params.id;
    if(id){
        Movie.findById(id,function (err,movie) {
            Category.find({},function (err,categories) {
                res.render('admin',{
                    title:'imooc 后台更新',
                    movie:movie,
                    categories:categories
                })
            })
        })
    }
}
/*删除电影*/
exports.del = function (req,res) {
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id},function (err,movie) {
            if(err){
                console.log(err);
            }else{
                res.json({success:1})
            }
        })
    }
}
/*列表页*/
exports.list = function (req,res) {
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err)
        }
        res.render('list',{
            title:'imooc 列表',
            movies:movies
        })
    })
}
/*文件是否上传完毕*/
exports.savePoster = function (req,res,next) {
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;
    if(originalFilename){
        fs.readFile(filePath,function (err,data) {
            var timestamp = Date.now();
            var type = posterData.type.split('/')[1];
            var poster = timestamp + '.' +type;
            var newPath = path.join(__dirname,'../../','/public/upload/'+poster);
            console.log(newPath);
            fs.writeFile(newPath,data,function (err) {
                req.poster = poster;
                next();
            })
        })
    }else{
        next()
    }
}
/*admin post movie*/
exports.save = function (req,res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    /*判断有没有上传海报*/
    if(req.poster){
        movieObj.poster = req.poster;
    }
    /*先判断id是否存储过*/
    if(id){
        /*已经存储过的*/
        Movie.findById(id,function (err,movie) {
            if(err){
                console.log(err)
            }
            /*用新的movie数据替换掉原来的(查询到的数据)数据*/
            _movie = _.extend(movie,movieObj);
            _movie.save(function (err,movie) {
                if(err){
                    console.log(err)
                }
                var categoryId = movie.category;
                var categoryName = movie.categoryName;
                if(categoryId){
                    Category.findById(categoryId,function (err,category) {
                        category.movies.push(movie._id);
                        category.save(function (err,category) {
                            res.redirect('/movie/'+movie._id)
                        })
                    })
                }else if(categoryName){
                    var category = new Category({
                        name:categoryName,
                        movies:[movie._id]
                    })
                    category.save(function (err,category) {
                        movie.category = category._id;
                        movie.save(function (err,movie) {
                            res.redirect('/movie/'+movie._id)
                        })
                    })
                }
            })
        })
    }else{
        /*传入数据*/
        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;
        _movie = new Movie(movieObj)
        _movie.save(function (err,movie) {
            if(err){
                console.log(err)
            }
            if(categoryId){
                Category.findById(categoryId,function (err,category) {
                    category.movies.push(movie._id);
                    category.save(function (err,category) {
                        res.redirect('/movie/'+movie._id)
                    })
                })
            }else if(categoryName){
                var category = new Category({
                    name:categoryName,
                    movies:[movie._id]
                })
                category.save(function (err,category) {
                    movie.category = category._id;
                    movie.save(function (err,movie) {
                        res.redirect('/movie/'+movie._id)
                    })
                })
            }
        })
    }
}
/*详情页*/
exports.detail = function (req,res) {
    var id = req.params.id;
    Movie.findById(id,function (err,movie) {
        Comment
            .find({movie:id})
            .populate('from','name') //通过from 去找name
            .populate('reply.from reply.to','name')
            .exec(function (err,comments) {
                res.render('detail',{
                    title:'imooc 详情页',
                    movie:movie,
                    comments:comments
                })
            })
    })
}
