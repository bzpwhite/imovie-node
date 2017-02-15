var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CommentSchemas = new Schema({
    movie:{type:ObjectId,ref:'Movie'},
    from:{type:ObjectId,ref:'User'},
    reply:[
        {
            from:{type:ObjectId,ref:'User'},
            to:{type:ObjectId,ref:'User'},
            content:String
        }
    ],
    content:String,
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
module.exports = CommentSchemas