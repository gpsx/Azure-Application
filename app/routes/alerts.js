var config = require('../../config/db')
var sql = require('mssql')

module.exports = function(application){

	application.use(function(req,res,next){
        if(['/login'].indexOf(req.url) === -1 && ['/register'].indexOf(req.url) === -1 && !req.session.user){	  
            res.redirect('/login');
        }else{
            next();
        }
    });
	
	application.get('/alerts', (req, res)=>{
        res.render('alerts/allAlerts', {n : 'Histórico de Alertas'});
    })
    
}