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
		res.redirect('/search/user');
	}
}

module.exports={isLoggedIn,admin};