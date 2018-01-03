var users=require('./users'),
	express=require('express'),
	details=require('./Details'),
	{calculation}=require('./cal'),
	{isLoggedIn}=require('./middleware'),
	{admin}=require('./middleware'),
	passport=require('passport'),
	router=express.Router({mergeParams:true});


router.get('/',[isLoggedIn,admin],function(req,res)
{
	res.render('add');
});


router.post('/',[isLoggedIn,admin],function(req,res)
{
	var username=req.body.x.username;
	var X=req.body.x;
	X.name=X.name.toLowerCase();
	details.create(X,function(err,data)
	{
		if(err)
		console.log(err);
		else
		{
			users.find({username:username},function(err,user)
			{
				if(user.length)
				{
					user[0].details.push(data._id);
					calculation(user[0],data);
					user[0].save(function(err,user)
					{
						if(err) res.redirect('/new');
						else res.redirect('/search');	
					});
				}
				else
				{
					var user =new users({
						username:username,
						name:X.name,
						password:'123456789a',
						role:'user'	
					});
					users.register(user,user.password,function(err,user)
					{
						if(err)console.log(err);
						else
						{
							user.details.push(data._id);
							calculation(user,data);
							user.save(function(err,u)
							{
								if(err) res.redirect('/new');
								else res.redirect('/search');
							});
						}
					});
				}
			});
		}
	});
});

module.exports=router;