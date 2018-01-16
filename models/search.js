var users=require('./users'),
	express=require('express'),
	details=require('./Details'),
	{isLoggedIn}=require('./middleware'),
	{admin}=require('./middleware'),
	router=express.Router({mergeParams:true});

router.get('/',[isLoggedIn,admin],function(req,res)
{
	res.render('search',{x:false,y:true});
});

router.get('/user',isLoggedIn,function(req,res)
{
	users.findById(req.user.id).populate('details').exec(function(err,data)
	{
		if (err) {req.logout();res.redirect('/');}
		else res.render('search',{y:false,x:true,content:data.details,user:data});
	});
});

router.post('/',[isLoggedIn,admin],function(req,res)
{
	var username=req.body.username;
	users.find({$or:[{username:username},{name:username.toLowerCase()}]}).populate("details").exec(function(error,content)
	{
		if(content.length)res.render('search',{content:content[0].details,user:content[0],x:true,y:true});
		else res.redirect('/search');
	});
});

module.exports=router;