$('.dropdown')
  .dropdown()
;
var p=$("#password");
var s=$("#cnfpass");
var but=$("#sub");
var error=$("#error");
console.log(p,s,but);
s.on('change keyup paste', function() {
    if(s.val()===p.val())
    {
    	error.removeClass('negative');
    	error.addClass('positive');
    	error.html("Click Submit Button");
    	but.removeClass('disabled');
    }
    else
    {
    	but.addClass('disabled');
    	error.addClass('ui negative message');
    	error.html("* confirm password And password must be same");
    }
});