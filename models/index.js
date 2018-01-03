var users=require('./users'),
	express=require('express'),
	{isLoggedIn}=require('./middleware'),
	router=express.Router({mergeParams:true});

router.get('/showall',isLoggedIn,function(req,res)
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


router.get('/',function(req,res)
{
	res.render('home');
});

router.post('/signin',passport.authenticate("local",{
	successRedirect:'/new',
	failureRedirect:'/'
}));

module.exports=router;