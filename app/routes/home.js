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
        res.render('home/home', {n: 'Página Inicial'})
    })};