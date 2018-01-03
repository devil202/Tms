var users=require('./users'),
	express=require('express'),
	{isLoggedIn}=require('./middleware'),
	router=express.Router({mergeParams:true});


router.get('/signout',function(req,res)
{
	req.logout();
	res.redirect("/");
});

router.get('/',function(req,res)
{
	res.render('home');
});

router.get('/changepw',isLoggedIn,function(req,res)
{
	res.render('changepw');
});

router.post('/changepw/:id',isLoggedIn,function(req,res)
{
	var id=req.params.id;
	users.findById(id,function(err,user)
	{
		if(!err)
		{
			var u=new users({
				username:user.username,
				name:user.name,
				password:req.body.password,
				role:user.role,
				details:user.details,
				total:user.total,
				dtotal:user.dtotal,
				ctotal:user.ctotal,
				date:user.date
			});
			users.findByIdAndRemove(id,function(err,user)
				{
					if (err) res.redirect('back');
					else
					{
						users.register(u,u.password,function(err,user)
						{
							if(err) res.redirect('back');
							else 
								{
									req.logout();
									res.redirect("/");
								}
						});
					}
				});
		}
	});
});

router.post('/signin',passport.authenticate("local",{
	successRedirect:'/new',
	failureRedirect:'/'
}));

module.exports=router;