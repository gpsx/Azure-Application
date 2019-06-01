var config = require('../../config/db')
var sql = require('mssql')

module.exports = function (application) {

    application.use(function (req, res, next) {
        if (['/login'].indexOf(req.url) === -1 && ['/register'].indexOf(req.url) === -1 && !req.session.user) {
            res.redirect('/login');
        } else {
            next();
        }
    });

    application.get('/profile', (req, res) => {
        res.render('profile/profile', {n: 'Perfil do ' + req.session.user[0].Nome, user: req.session.user[0] });
    })

    application.get('/users', (req, res) => {
        returnAllusers(req, res, req.body).then((data) =>{
            console.log(data);
            
            res.render('users/allUsers', {n: 'Todos os Usuários', user: req.session.user[0], users: data });
        });
    })

    application.post('/profile/add', (req, res) => {
        addUser(req, res, req.body).then((bool) =>{
            console.log(bool);
            
            bool ? res.redirect('/profile') : res.send('Erro ao adicionar')
        });
    })
    application.post('/profile/edit', (req, res) => {
        updateProfile(req, res, req.body).then((bool) =>{
            console.log(bool);
            
            bool ? res.redirect('/') : res.send('Erro ao atualizar')
        });
    })

    profileInfo = (req, res)=>{
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
                    console.log(result);
                    
                    !err ? resolve(result.recodset) : resolve(false); console.log(err);	 
                })
             
            })
             
        })
        
    }
    returnAllusers = (req, res)=>{
        return new Promise((resolve,reject)=>{
            sql.connect(config, err => {
                // ... error checks
             
                // Query
                new sql.Request().query(`Select * from Usuario where Cliente_Id = ${req.session.user[0].Cliente_Id}`, (err, result) => {
                    // ... error checks
                    sql.close();
                    console.log(result);
                    
                    !err ? resolve(result.recordset) : resolve(false); console.log(err);	 
                })
             
            })
             
        })
        
    }
    updateProfile = (req, res, user)=>{
        return new Promise((resolve,reject)=>{
            sql.connect(config, err => {
                // ... error checks
             
                // Query
                new sql.Request().query(`update Usuario set Nome = '${user.name}', Usuario = '${user.user}', Senha = '${user.password}' where id = ${req.session.user[0].Id}`, (err, result) => {
                    // ... error checks
                    sql.close();
                    !err ? resolve(true) : resolve(false); console.log(err)	 
                })
             
            })
             
            sql.on('error', err => {
                // ... error handler
            })
        })
        
    }
    addUser = (req, res, user)=>{
        return new Promise((resolve,reject)=>{
            sql.connect(config, err => {
                // ... error checks
             
                // Query
                new sql.Request().query(`insert into Usuario(Usuario, Senha, Nome, Cliente_Id, Nivel) 
                                         values ('${user.user}','${user.password}','${user.name}', ${req.session.user[0].Cliente_Id},'user')`, (err, result) => {
                    // ... error checks
                    sql.close();
                    !err ? resolve(true) : resolve(false); console.log(err)	 
                })
             
            })
             
            sql.on('error', err => {
                // ... error handler
            })
        })
        
    }

}