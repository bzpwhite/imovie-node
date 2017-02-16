var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    categoryName:String,
    category:{
        type:ObjectId,
        ref:'Category'
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

/*每次保存数据都会调用此方法*/
MovieSchema.pre('save',function (next) {
    /*判断是否为新数据*/
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
})

MovieSchema.statics = {
    /*获取所有的数据*/
    fetch:function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function (id,cb) {
        return this.findOne({_id:id})
            .exec(cb)
    }
}

module.exports = MovieSchema;