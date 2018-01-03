var users=require('./users'),
	express=require('express'),
	{isLoggedIn}=require('./middleware'),
	{admin}=require('./middleware'),
	router=express.Router({mergeParams:true});


router.get('/',[isLoggedIn,admin],function(req,res)
{
	users.find({},function(err,users)
	{
		if(users.length)
		{
			res.render('showall',{users:users});
		}
		else res.redirect('back');
	});
});

router.get('/:id',[isLoggedIn,admin],function(req,res)
{
	var id=req.params.id;
	users.findById(id).populate('details').exec(function(err,user)
	{
		if(!err)
		{
			res.render('search',{y:false,x:true,content:user.details,user:user});
		}
		else res.redirect('back');
	});
});

module.exports=router;