var config = require('../../config/db')
var sql = require('mssql')

module.exports = function(app){
	
	app.get('/notification/readAll', (req, res)=>{
        readAll(req, res).then(result =>{
            console.log(result);
            res.redirect('/')
        })
        
    })

    app.get('/notification/detail/:id', function (req, res, next) {
		console.log('ID:', req.params.id);
		readNotification(req, res, req.params.id).then(result =>{
            console.log(result);
            res.redirect(`/sensors/detail/${req.params.id}`)
        })
	});

    readAll = (req, res)=>{
        return new Promise((resolve,reject)=>{
            sql.connect(config, err => {
                // ... error checks
             
                // Query
                new sql.Request().query(`update notificacoes set Estado = 'inativo' where Cliente_id = ${req.session.user[0].Cliente_Id}`, (err, result) => {
                    // ... error checks
                    sql.close();
                    !err ? resolve(result) : console.log(err)	 
                })
             
            })
             
            sql.on('error', err => {
                // ... error handler
            })
        })
        
    }
    readNotification = (req, res, id)=>{
        return new Promise((resolve,reject)=>{
            sql.connect(config, err => {
                // ... error checks
             
                // Query
                new sql.Request().query(`update notificacoes set Estado = 'inativo' where key_sensor = '${id}'`, (err, result) => {
                    // ... error checks
                    sql.close();
                    !err ? resolve(result) : console.log(err)	 
                })
             
            })
             
            sql.on('error', err => {
                // ... error handler
            })
        })
        
    }
    
}