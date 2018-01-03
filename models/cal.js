var rate=require('./Rate');

var hal=0,tai=0,rota=0,plough=0,cp=0,to=0;

function rates(callback) {
	rate.find({},function(error,rates)
	{
		if(rates.length)
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
		}
	});
}

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
}

module.exports={calculation,rates};