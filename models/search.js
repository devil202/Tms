var users=require('./users'),
	express=require('express'),
	details=require('./Details'),
	{isLoggedIn}=require('./middleware'),
	router=express.Router({mergeParams:true});

router.get('/',isLoggedIn,function(req,res)
{
	res.render('search',{x:false,y:true});
});

router.post('/',isLoggedIn,function(req,res)
{
	var username=req.body.username;
	users.find({$or:[{username:username},{name:username.toLowerCase()}]}).populate("details").exec(function(error,content)
	{
		if(content.length)res.render('search',{content:content[0].details,user:content[0],x:true,y:true});
		else res.redirect('/search');
	});
});

module.exports=router;