var db=require('mongoose');
var detailSchema=new db.Schema({
	username:String,
	name:String,
	area:String,
	equip:String,
	loc:String,
	payment:String,
	date:{type:Date,default:Date.now}
});

module.exports=db.model('Detail',detailSchema);