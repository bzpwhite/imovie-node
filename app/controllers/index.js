var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function (req,res) {
    Category
        .find({})
        .populate({path:'movies',options:{limit:5}})
        .exec(function (err,categories) {
            if(err){
                console.log(err)
            }
            console.log(categories)
            res.render('index',{
                title:'imooc 首页',
                categories:categories
            })
        })
}
exports.search = function (req,res) {
    var catId = req.query.cat;
    var page = parseInt(req.query.p) || 0;
    var count = 2 ;
    var index = page * count;
    var q = req.query.q;
    if(catId){
        Category
            .find({_id:catId})
            .populate({path:'movies'})
            .exec(function (err,category) {
                if(err){
                    console.log(err)
                }
                var category = category[0] || {}
                var movies = category.movies || [];
                console.log(movies.slice(index,index+count))
                res.render('result',{
                    title:'imooc 结果列表页',
                    keyword:category.name,
                    currentPage:(page+1),
                    totalPage:Math.ceil(movies.length / count),
                    movies:movies.slice(index,index+count),
                    query:'&cat='+catId
                })
            })
    }else{
        Movie
            .find({title:new RegExp(q+'.*','i')})
            .exec(function (err,movies) {
                if(err){
                    console.log(err)
                }
                var results = movies.slice(index,index+count);
                res.render('result',{
                    title:'imooc 结果列表页',
                    keyword:q,
                    currentPage:(page+1),
                    totalPage:Math.ceil(movies.length / count),
                    movies:results,
                    query:'&q='+catId
                })
            })
    }
}
