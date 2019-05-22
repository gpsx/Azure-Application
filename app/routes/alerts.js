var config = require('../../config/db')
var sql = require('mssql')

module.exports = function(application){

	application.use((req,res,next)=>{
		console.log(req.url);
		next();
	});
	
	application.get('/alerts', (req, res)=>{
        res.render('alerts/allAlerts', {n : 'Histórico de Alertas'});
    })
    
}