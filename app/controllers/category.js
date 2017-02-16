var Category = require('../models/category');
/*后台登陆页*/
exports.new = function (req,res) {
    res.render('category_admin',{
        title:'imooc 后台分类录入页',
    })
}

/*admin post movie*/
exports.save = function (req,res) {
    var _category = req.body.category;
    var category = new Category(_category)
        category.save(function (err,category) {
            if(err){
                console.log(err)
            }
            res.redirect('/admin/categorylist')
        })
}

exports.list = function (req,res) {
    Category.fetch(function (err,categories) {
        if(err){
            console.log(err)
        }
        res.render('categorylist',{
            title:'imooc 电影分类列表页',
            categories:categories
        })
    })
}
