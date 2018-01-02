var db=require('mongoose');
	// passportLocalMongoose=require('passport-local-mongoose');
var userSchema=new db.Schema({
	username:String,
	name:String,
	password:String,
	role:String,
	details:[{
		type:db.Schema.Types.ObjectId,
		ref:"detail"
	}],
	date:{type:Date,default:Date.now},
	ctotal:{type:Number,default:0},
	dtotal:{type:Number,default:0},
	total:{type:Number,default:0}
});

// userSchema.plugin(passportLocalMongoose);

module.exports=db.model('User',userSchema);