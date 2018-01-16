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
	res.render('home',{x:false});
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

router.post('/signin', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('home',{x:true}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/new');
    });
  })(req, res, next);
});

module.exports=router;