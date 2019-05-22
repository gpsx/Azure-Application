var config = require('../../config/db')
var sql = require('mssql')

module.exports = function(application){
	users = application.get('users');

	application.use((req,res,next)=>{
		console.log(req.url);
		next();
	});
	
	application.get('/sensors', (req, res)=>{
        res.render('sensors/showAll', {n : 'Todos os sensores'});
    })

    application.get('/sensors/add', (req, res)=>{
        res.render('sensors/add', {n : 'Adicionar Novo Sensor'});
    })
    
}