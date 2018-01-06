// Neccesarry  Dependencies
var express=require('express'),
	body=require('body-parser'),
	db=require('mongoose'),
	session=require('express-session'),
	MongoStore = require('connect-redis')(session); 
	details=require('./models/Details'),
	users=require('./models/users'),
	rate=require('./models/Rate'),
	{isLoggedIn}=require('./models/middleware')
	passport=require('passport'),
	{rates}=require('./models/cal'),
	{calculation}=require('./models/cal'),
	LocalStrategy=require('passport-local'),
	rtg   = require("url").parse(process.env.REDISTOGO_URL);
	redis = require("redis").createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(":")[1]);
	app=express();



//App Configurations

app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(express.static('public'));
// db.connect('mongodb://localhost/Tms');
db.connect('mongodb://brijraj:brijraj@ds239137.mlab.com:39137/tms');
// db.connect('mongodb://brijraj:brijraj@cluster0-shard-00-00-4l7li.mongodb.net:27017,cluster0-shard-00-01-4l7li.mongodb.net:27017,cluster0-shard-00-02-4l7li.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');


// Password Hash
app.use(session({
    secret:"This is a Tractor Management System.",
    store: new RedisStore(redis),
    resave:false,
	saveUninitialized:false
}));

// Passpost Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

rates();

app.use(function(req,res,next)
{
	res.locals.Admin=req.user;
	res.locals.moment=require('moment');
	res.locals.formatTitle=require('format-title');
	next();
});

//Routes
var mainRoute=require('./models/index'),
	newRoute=require('./models/new'),
	updateRoute=require('./models/update'),
	searchRoute=require('./models/search'),
	showRoute=require('./models/showall'),
	settingRoute=require('./models/setting');




// routes
app.use("/",mainRoute);
app.use("/new",newRoute);
app.use("/update",updateRoute);
app.use("/search",searchRoute);
app.use("/setting",settingRoute);
app.use("/showall",showRoute);


// var user=new users({
// 	name:'brijraj singh',
// 	username:'9451510063',
// 	password:'brijraj94@',
// 	role:'admin'
// });
// users.register(user,user.password,function(err,user)
// {
// 	if(err)console.log(err);
// 	else console.log(user);
// });

const port=process.env.PORT||3000;

app.listen(port,function () {
	console.log('Server Started!!!');
});
