var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 4000
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var logger = require('morgan');
var connectMultiparty = require('connect-multiparty');

var MongoStore = require('connect-mongo')(session);
var dbUrl = 'mongodb://localhost/imooc';
/*连接数据库*/
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

app.set('views','./app/views/pages')
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname,'public')))
app.set('port',port)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.locals.moment = require('moment');
app.use(cookieParser())
app.use(session({
    secret:'imooc',
    resave: false,
    saveUninitialized: true,
    store:new MongoStore({
        url:dbUrl
    })
}))
app.use(connectMultiparty()) //处理上传的文件
app.listen(3000);

/*设置报错信息*/
if('development' === app.get('env')){
    app.set('showStackError',true);
    app.use(logger(':method :url :status'))
    app.locals.pretty = true;
    mongoose.set('debug',true);
}
require('./config/routes')(app);
