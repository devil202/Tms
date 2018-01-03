var users=require('./users'),
	express=require('express'),
	details=require('./Details'),
	{isLoggedIn}=require('./middleware'),
	router=express.Router({mergeParams:true});


router.get('/',isLoggedIn,function(req,res)
{
	res.render('update',{x:false});
});

router.post('/',isLoggedIn,function(req,res)
{
	var username=req.body.username;
	var payment=req.body.payment;
	users.findOne({username:username},function(err,user)
	{
		if(user==null)
		{
			res.redirect('back');
		}
		else
		{
			details.create({
				username:username,
				name:user.name,
				payment:payment,	
			},function(err,d)
			{
				var old=user.total;
				user.details.push(d._id);
				user.ctotal+=parseInt(payment);
				user.total=user.dtotal-user.ctotal;
				user.save(function(err,user)
				{
					if(err)console.log(err);
					else res.render('update',{x:true,old:old,total:user.total});
				});
			});
		}
	});
});


module.exports=router;