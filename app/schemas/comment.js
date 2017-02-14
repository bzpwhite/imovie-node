var mongoose = require('mongoose');
var Schema = mongoose.schema;
var ObjectId = Schema.Types.ObjectId;
var CommentSchemas = new Schema({
    movie:{type:ObjectId,ref:'Movie'},
    from:{type:ObjectId,ref:'User'},
    to:{type:ObjectId,ref:'User'},
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