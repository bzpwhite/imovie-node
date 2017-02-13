var User = require('../models/user');
/*signup*/
exports.showSignup = function (req,res) {
    res.render('signup',{'title':'注册页'})
}
exports.signup = function (req,res) {
    var _user = req.body.user;
    User.findOne({name:_user.name},function (err,user) {
        if(err){
            console.log(err)
        }
        if(user){
            return  res.redirect('/')
        }else{
            var user = new User(_user);
            user.save(function (err,user) {
                if(err){
                    console.log(err)
                }
                res.redirect('/admin/userlist');
            })
        }
    })
}
/*signin*/
exports.showSignin = function (req,res) {
    res.render('signin',{title:'登录页'})
}
exports.signin = function (req,res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({name:name},function (err,user) {
        if(err){
            console.log(err);
        }
        if(!user){
            return res.redirect('/signup')
        }
        user.comparePassword(password,function (err,isMatch) {
            if(err){
                console.log(err)
            }
            if(isMatch){
                req.session.user = user; /*储存登录状态*/
                console.log('Password is  matched!')
                return res.redirect('/');
            }else{
                console.log('Password is not matched!')
            }
        })
    })
}
/*logout*/
exports.logout = function (req,res) {
    delete req.session.user;
    res.redirect('/');
}
/*用户列表页*/
exports.list = function (req,res) {
    User.fetch(function (err,users) {
        if(err){
            console.log(err)
        }
        res.render('userlist',{
            title:'imooc 用户列表',
            movies:users
        })
    })
}

