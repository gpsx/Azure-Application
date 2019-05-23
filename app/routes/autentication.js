var config = require('../../config/db')
var sql = require('mssql')

module.exports = function(application){
	users = application.get('users');

	application.use((req,res,next)=>{
		console.log(req.url);
		next();
	});
	
	application.get('/login', function(req, res){

		res.render('autentication/login', {n: 'Login'});
			
	});

	application.get('/register', function(req, res){
		res.render('autentication/register', {n: 'Registrar-se'});		
	});

	application.post('/login', function(req, res){
		var register = req.body;
		console.log(register);
		
		var auth = false;
		// for(user of users){
        //     if (user.username == login.username && user.password == login.pass) {
		// 		auth = true;
		// 	}          
		// }
		// auth ? res.send('Login Correto!') : res.redirect('/');

		
	});
	application.post('/register', function(req, res){
		var register = req.body;
		console.log(register);
		

		sql.connect(config).then(() => {
			return sql.query`Select * from Chaves where ${register.key}`
		}).then(result => {
			console.log(result);
			
			res.send(result);
			sql.close()
		}).catch(err => {
			console.log(err);
			sql.close()
			res.send('Falha ao estabelecer conexão com o banco');	
		});

		// sql.connect(config, err => {
		// 	// ... error checks
		 
		// 	const request = new sql.Request()
		// 	request.stream = true // You can set streaming differently for each request
		// 	request.query(`INSERT INTO Usuarios VALUES ('${register.name}', '${register.email}','${register.password}', ${register.fkIDclientes})`) // or request.execute(procedure)
		 
		// 	request.on('error', err => {
		// 		res.send(err)
		// 	})
		// 	request.on('done', result => {
		// 		console.log(result);
		// 		res.redirect('/');
		// 		sql.close();
		// 	})
			
		// })
	});
	application.get('/postlogin', function(req, res){
		if(req.session.auth) {
			res.render('postlogin')
		}else{
			res.redirect('/');
		}
	});
}