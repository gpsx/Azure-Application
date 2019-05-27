var config = require('../../config/db')
var sql = require('mssql')

module.exports = function(application){

	// application.use(function(req,res,next){
	// 	if(['/login'].indexOf(req.url) === -1 && !req.session.user){	  
	// 	  res.redirect('/login');
	// 	}else{
	// 	  next();
	// 	}
	// });
	var shar = "abcdefghijklmnopqrstuvwxyz1234567890";
	var letters = shar.split('');
	var code = '';
	
	application.get('/sensors', (req, res)=>{
		res.render('sensors/showAll', {n : 'Todos os sensores'});
	})

	application.get('/sensors/add', (req, res)=>{
		res.render('sensors/add', {n : 'Adicionar Novo Sensor', user: req.session.user[0]});
	})
	
	application.post('/sensors/register', (req, res)=>{
			addSensor(req.body, req, res);			
	})

	randomChar = (limit, l)=>{
		c = '';
		for (let i = 0; i < limit; i++) {
			c += l[(Math.random()*(l.length - 1)).toFixed(0)];			
		}
		return c;
	};
	addSensor = (sensor, req, res)=>{
		code = randomChar(15, letters);
		console.log(code);
		sql.connect(config, err => {
			// ... error checks
			const request = new sql.Request()
			request.stream = true // You can set streaming differently for each request
			request.query(`insert into Sensor(TempMax, TempMin, UmidMax, TempMin, Codigo, Cliente_id, Local) 
			values
				('${sensor.maxTemp}', '${sensor.maxTemp}', '${sensor.maxUmid}', '${sensor.minUmid}', '${code}', '${sensor.Cliente_Id}', '${sensor.Local}')`) // or request.execute(procedure)
		 
			request.on('error', err => {
				sql.close();
				console.log(err);
				res.redirect('/');

			})
			request.on('done', result => {
				sql.close();
				res.redirect('/')			
			})
			
		})
	}
    
}