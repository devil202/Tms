var db=require('mongoose');

var rateSchema=new db.Schema({
	name:String,
	rate:Number,
});

module.exports=db.model('Rate',rateSchema);