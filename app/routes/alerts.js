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
        seekAlerts(req, res).then(result =>{
            console.log(result);
            
            res.render('alerts/allAlerts', {n : 'Histórico de Alertas', alerts: result});
        })
        
    })

    seekAlerts = (req, res)=>{
        return new Promise((resolve,reject)=>{
            sql.connect(config, err => {
                // ... error checks
             
                // Query
                new sql.Request().query(`Select 
                                            a.Temperatura, a.Umidade, a.DataDMA, a.Hora, a.Estado, s.Local, s.Codigo 
                                            from  Alerta as a , Sensor as s 
                                            where a.Sensor_Id = s.id and Cliente_Id = ${req.session.user[0].Cliente_Id}`, (err, result) => {
                    // ... error checks
                    sql.close();
                    !err ? resolve(result.recordset) : console.log(err)	 
                })
             
            })
             
            sql.on('error', err => {
                // ... error handler
            })
        })
        
    }
    
}