var config = require('../../config/db')
var sql = require('mssql')

module.exports = function(application){
	users = application.get('users');

	application.use((req,res,next)=>{
		console.log(req.url);
		next();
	});
	
	application.get('/', function(req, res){
        res.render('home/home', {n: 'Página Inicial'})
	});
}