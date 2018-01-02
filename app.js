var express=require('express'),
	body=require('body-parser'),
	db=require('mongoose'),
	details=require('./models/Details'),
	users=require('./models/users'),
	rate=require('./models/Rate'),
	app=express();

var hal=0,tai=0,plough=0,rota=0,cp=0,to=0;

function rates() {
	rate.find({},function(error,rates)
	{
		rates.forEach(function(rate){
			if(rate.name=="Rotavator")
				rota=rate.rate;
			else if(rate.name=="Shovel Cultivator(Hal)")
				hal=rate.rate;
			else if(rate.name=="Harrow Discs(Tai)")
				tai=rate.rate;
			else if(rate.name=="Plough")
				plough=rate.rate;
		});
	});
}

rates();

function total(c,q)
{
	var r=parseInt(q);
	if(c=="Rotavator")
		to=rota*r;
	else if(c=="Plough")
		to=plough*r;
	else if(c=="Harrow Discs(Tai)")
		to=tai*r;
	else if(c=="Shovel Cultivator(Hal)")
		to=hal*r;
}


function calculation(user,data)
{
	cp=parseInt(data.payment);
	total(data.equip,data.area);
	user.ctotal+=cp;
	user.dtotal+=to;
	user.total=user.dtotal-user.ctotal;	
	console.log(user.total);
}

app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(express.static('public'));
db.connect('mongodb://localhost/Tms');
// db.connect('mongodb://brijraj:brijraj@ds239137.mlab.com:39137/tms');

app.get('/',function(req,res)
{
	res.render('home');
});

app.post('/signin',function(req,res)
{
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
					users.create({
						username:username,
						name:X.name,
						password:'123456789a',
						role:'user'	
					},function(err,user)
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


app.get('/update',function(req,res)
{
	res.render('update',{x:false});
});

app.post('/update',function(req,res)
{
	var username=req.body.username;
	var payment=req.body.payment;
	users.findOne({username:username},function(err,user)
	{
		if(user==null)
		{
			res.back();
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
	// rate.create(req.body.x,function(error,rate)
	// {
	// 	if (!error) {
	// 		res.render('settings');
	// 	}
	// });
	// console.log(req.body.x);
	rate.findOneAndUpdate({'name':req.body.x.name},req.body.x,function(error,rate){
		if(!error)
		{
			rates();
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
	res.render('search',{x:false});
});


app.post('/search',function(req,res)
{
	var username=req.body.username;
	users.find({$or:[{username:username},{name:username}]}).populate("details").exec(function(error,content)
	{
		if(content.length)
		{
			// console.log(content);
			res.render('search',{content:content[0].details,user:content[0],x:true});
		}
		else
		{
			res.redirect('/search');
			// console.log(error);
		}
	});
});
const port=process.env.PORT||3000;
app.listen(port,function () {
	console.log('Server Started!!!');
});
