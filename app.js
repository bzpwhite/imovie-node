var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 4000
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('underscore');

var mongoose = require('mongoose');
var Movie = require('./models/movie');
/*连接数据库*/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname,'public')))
app.set('port',port)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.locals.moment = require('moment');
app.listen(3000);

/*首页*/
app.get('/',function (req,res) {
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err)
        }
        res.render('index',{
            title:'imooc 首页',
            movies:movies
        })
    })
})

/*详情页*/
app.get('/movie/:id',function (req,res) {
    var id = req.params.id;
    Movie.findById(id,function (err,movie) {
        if(err){
            console.log(err)
        }
        res.render('detail',{
            title:'imooc 详情页',
            movie:movie
        })
    })
})

/*列表页*/
app.get('/admin/list',function (req,res) {
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err)
        }
        res.render('list',{
            title:'imooc 列表',
            movies:movies
        })
    })
})


/*admin post movie*/
app.post('/admin/movie/new',function (req,res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    /*先判断id是否存储过*/
    if(id !== 'undefined'){
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
                res.redirect('/movie/'+movie._id)
            })
        })
    }else{
         /*传入数据*/
        _movie = new Movie({
            title:movieObj.title,
            doctor:movieObj.doctor,
            country:movieObj.country,
            year:movieObj.year,
            language:movieObj.language,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })
        _movie.save(function (err,movie) {
            if(err){
                console.log(err)
            }
            res.redirect('/movie/'+movie._id)
        })
    }
})
/*后台登陆页*/
app.get('/admin/movie',function (req,res) {
    res.render('admin',{
        title:'imooc 后台录入页',
        movie: {
                title:'',
                doctor:'',
                country:'',
                year:'',
                poster:'',
                flash:'',
                summary:'',
                language:''
            }
    })
})
/*admin update movie*/
app.get('/admin/update/:id',function (req,res) {
    var id = req.params.id;
    if(id){
        Movie.findById(id,function (err,movie) {
            if(err){
                console.log(err)
            }
            res.render('admin',{
                title:'imooc 后台更新',
                movie:movie
            })
        })
    }
})
/*删除电影*/
app.delete('/admin/list',function (req,res) {
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
})