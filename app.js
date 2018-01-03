// Neccesarry  Dependencies
var express=require('express'),
	body=require('body-parser'),
	db=require('mongoose'),
	details=require('./models/Details'),
	users=require('./models/users'),
	rate=require('./models/Rate'),
	{isLoggedIn}=require('./models/middleware')
	passport=require('passport'),
	{rates}=require('./models/cal'),
	{calculation}=require('./models/cal'),
	LocalStrategy=require('passport-local'),
	app=express();


// Password Hash
app.use(require('express-session')({
	secret:"This is a Tractor Management System.",
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
	res.locals.user=req.user;
	res.locals.moment=require('moment');
	res.locals.formatTitle=require('format-title');
	next();
});

//Routes
var mainRoute=require('./models/index'),
	newRoute=require('./models/new'),
	updateRoute=require('./models/update'),
	searchRoute=require('./models/search'),
	settingRoute=require('./models/setting');


app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(express.static('public'));
db.connect('mongodb://localhost/Tms');
// db.connect('mongodb://brijraj:brijraj@ds239137.mlab.com:39137/tms');

// routes
app.use("/",mainRoute);
app.use("/new",newRoute);
app.use("/update",updateRoute);
app.use("/search",searchRoute);
app.use("/setting",settingRoute);


// var user=new users({
// 	name:'brijraj singh',
// 	username:'9451510063',
// 	Password:'brijraj94@',
// 	role:'admin',
// });
// users.register(user,user.Password);

const port=process.env.PORT||3000;

app.listen(port,function () {
	console.log('Server Started!!!');
});
