var express=require('express'),
	body=require('body-parser'),
	db=require('mongoose'),
	details=require('./models/Details'),
	users=require('./models/users'),
	rate=require('./models/Rate'),
	app=express();

app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(express.static('public'));
// db.connect('mongodb://localhost/Tms');
db.connect('mongodb://himanshu:himanshu@ds135917.mlab.com:35917/tms');

app.get('/',function(req,res)
{
	res.render('home');
});

app.post('/signin',function(req,res)
{
	console.log(req.body);
	res.redirect('/new');
});

app.get('/new',function(req,res)
{
	res.render('add');
});

app.post('/new',function(req,res)
{
	var username=req.body.x.username;
	var X=req.body.x;
	users.findOne({'username':username},function(err,user)
	{
		console.log(user);
		if(user==null)
		{
			users.create({
				'username':username,
				'name':X.name,
				'password':'123456789a'
			},function(err,user)
			{
				// console.log(user);
				details.create(X,function(err,detail)
				{
					// console.log(details);
					if(!err)
					{
						console.log(detail);
						user.detail.push(detail);
						user.save();
					}
					else
					console.log(err);
				});	
			});
		}
		else
		{
			details.create(X,function(err,detail)
			{
				if(!err)
				{
					console.log(user);
					user.detail.push(detail);	
					user.save();
				}
				else
				console.log(err);
			});
		}
	});
	// res.send('hello');
	res.redirect('/search');
});


app.get('/setting',function(req,res)
{
	rate.find({},function(error,rates)
	{
		if(!error)
			res.render('settings',{rates:rates});
		else
			console.log(error);
	});
});

app.post('/setting',function(req,res)
{
	console.log(req.body.x);
	rate.findOneAndUpdate({'name':req.body.x.name},req.body.x,function(error,rate){
		if(!error)
		{
			console.log(rate);
			res.redirect('/setting');
		}
		else
		{
			console.log(error);
		}
	});
});
app.get('/search',function(req,res)
{
	var username="7508276344";
	users.find({'username':username}).populate("detail").exec(function(error,content)
	{
		if(!error)
		{
			console.log(content[0].detail);
			res.render('search',{content:content[0].detail});
		}
		else
		{
			console.log(error);
		}
	});
});

app.listen(3000,function () {
	console.log('Server Started!!!');
});
