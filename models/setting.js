var rate=require('./Rate'),
	express=require('express'),
	{isLoggedIn}=require('./middleware'),
	{admin}=require('./middleware'),
	router=express.Router({mergeParams:true});

router.get('/',isLoggedIn,function(req,res)
{
	rate.find({},function(error,rates)
	{
		if(!error)
			res.render('settings',{rates:rates});
		else
			console.log(error);
	});
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
	// rate.create(req.body.x,function(err,rate)
	// {
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// 	else res.redirect('/setting');
	// });
	rate.findOneAndUpdate({'name':req.body.x.name},req.body.x,function(error,rate){
		if(!error)
		{
			rates();
			res.redirect('/setting');
		}
		else res.redirect('/setting');
	});
});

module.exports=router;