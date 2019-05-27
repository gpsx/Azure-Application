var config = require('../../config/db')
var sql = require('mssql')

module.exports = function(application){

	application.use(function(req,res,next){
		if(['/login'].indexOf(req.url) === -1 && !req.session.user){	  
		  res.redirect('/login');
		}else{
		  next();
		}
	});
	
	application.get('/profile', (req, res)=>{
        res.render('profile/profile', {n : 'Perfil do ' + req.session.user[0].Email});
    })
    
}