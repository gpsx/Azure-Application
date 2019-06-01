var config = require('../../config/db')
var sql = require('mssql')

module.exports = function(application){
    users = application.get('users');

    application.use(function(req,res,next){
        if(['/login'].indexOf(req.url) === -1 && ['/register'].indexOf(req.url) === -1 && !req.session.user){	  
            res.redirect('/login');
        }else{
            next();
        }
    });

    application.get('/', function(req, res){
        counts(req, res).then(counts =>{
            avgSensor(req, res).then(avgS =>{
                res.render('home/home', {n: 'Página Inicial', count : counts, avg : avgS})
            })
        })
    })};

    counts = (req, res)=>{
        return new Promise((resolve,reject)=>{
            sql.connect(config, err => {
                // ... error checks
             
                // Query
                new sql.Request().query(`select count(distinct u.id) as 'users', count(distinct s.id) as 'sensors', count(distinct a.id) as 'alerts'
                from Usuario as u, Sensor as s left join Alerta as a on s.id = a.Sensor_Id
                where u.Cliente_Id = ${req.session.user[0].Cliente_Id} and s.Cliente_Id = ${req.session.user[0].Cliente_Id} ;`, (err, result) => {
                    // ... error checks
                    sql.close();
                    !err ? resolve(result.recordset[0]) : console.log(err)	 
                })
             
            })
             
            sql.on('error', err => {
                // ... error handler
            })
        })
        
    }

    avgSensor = (req,res)=>{
        return new Promise((resolve,reject)=>{
            sql.connect(config, err => {
                // ... error checks
             
                // Query
                new sql.Request().query(`select avg(h.Temperatura) as 'avg', (select sen.local from sensor as sen where sen.id = s.id) as 'local', (select sen.Codigo from sensor as sen where sen.id = s.id) as 'key' 
                                         from Historico as h join Sensor as s on h.Sensor_Id = s.id 
                                         where s.Cliente_Id = ${req.session.user[0].Cliente_Id} group by s.id;`, (err, result) => {
                    // ... error checks
                    sql.close();
                    console.log(result.recordset)
                    !err ? resolve(result.recordset) : console.log(err)	 
                })
             
            })
             
            sql.on('error', err => {
                // ... error handler
            })
        })
    }