var users=require('./users');

function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect('/');
}

function admin(req,res,next)
{
	if(req.user.role=="admin")
	{
		return next();
	}
	else
	{
		users.findById(req.user.id).populate('details').exec(function(err,data)
		{
			res.render('search',{y:false,x:true,content:data.details,user:data});
		});
	}
}

module.exports={isLoggedIn,admin};