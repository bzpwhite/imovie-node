var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category')

module.exports = function (app) {
    /*pre handle*/
    app.use(function (req,res,next) {
        var _user = req.session.user;
        app.locals.user = _user;
        next()
    })
    /*首页*/
    app.get('/',Index.index);
    /*详情页*/
    app.get('/movie/:id',Movie.detail)
    /*列表页*/
    app.get('/admin/list',User.signinRequired,User.adminRequired,Movie.list)
    /*admin post movie*/
    app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.save)
    /*后台登陆页*/
    app.get('/admin/movie',User.signinRequired,User.adminRequired,Movie.new)
    /*admin update movie*/
    app.get('/admin/update/:id',User.signinRequired,User.adminRequired,Movie.update)
    /*删除电影*/
    app.delete('/admin/list',User.signinRequired,User.adminRequired,Movie.del)
    /*user*/
    app.post('/user/signup',User.signup)
    app.post('/user/signin',User.signin)
    app.get('/signin',User.showSignin)
    app.get('/signup',User.showSignup)
    app.get('/logout',User.logout)
    app.get('/admin/userlist',User.signinRequired,User.adminRequired,User.list)
    /*comment*/
    app.post('/user/comment',User.signinRequired,Comment.save)
    //category
    app.get('/admin/category',User.signinRequired,User.adminRequired,Category.new)
    app.post('/admin/category/new',User.signinRequired,User.adminRequired,Category.save)
    app.get('/admin/categorylist',User.signinRequired,User.adminRequired,Category.list)
}
