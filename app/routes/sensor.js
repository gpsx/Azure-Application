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
	var sensors;
	
	application.get('/sensors', async (req, res)=>{
		searchSensors(req, res);
	})

	application.get('/sensors/add', async (req, res)=>{
		
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
			request.query(`insert into Sensor(TempMax, TempMin, UmidMax, UmidMin, Codigo, Cliente_id, Local) 
			values
				('${sensor.maxTemp}', '${sensor.maxTemp}', '${sensor.maxUmid}', '${sensor.minUmid}', '${code}', '${sensor.Cliente_Id}', '${sensor.local}')`) // or request.execute(procedure)
		 
			request.on('error', err => {
				sql.close();
				console.log(err);
				res.redirect('/');

			})
			request.on('done', result => {
				console.log(result);
				
				sql.close();
				res.redirect('/sensors')			
			})
			
		})
	}
	searchSensors = (req, res)=>{
		sql.connect(config).then(() => {
			return sql.query`Select s.Local,s.id, a.Temperatura from Sensor as s left join Alerta as a on a.Sensor_Id = s.id and Cliente_Id = ${req.session.user[0].Cliente_Id}`
		}).then(result => {
			sql.close();									
			assocTemp(req, res, result.recordset);
			
		}).catch(err => {
			console.log(err);
			sql.close()
			res.send('Falha ao estabelecer conexão com o banco');	
		});
	}
	assocTemp = (req, res, sensors)=>{
		s = [], temps = [{}];
		console.log(sensors);
		for (let i = 0; i < sensors.length; i++) {
			s.push({id: sensors[i].id, l: sensors[i].Local});
			if(s[i].id == s[s.length-1].id && s.length > 0){
				console.log(s[i].id);	
			}
			s.pop();
		}
		for (let i = 0; i < sensors.length; i++) {
			id = 0;
            s.push({id: sensors[i].id, l: sensors[i].Local});
            if(s[i].id == s[s.length - 1].id && s.length-1 != 0){
                console.log(s[i].id);
				id= 0;  
            }else{
				id++;
			}
		}
		for (let i = 0; i < sensors.length; i++) {
            if(s.length == 0){
				s.push({id: sensors[i].id, l: sensors[i].Local});
				console.log(s, i);
				
            }else if(s[i-1].id != sensors[i].id){
				s.push({id: sensors[i].id, l: sensors[i].Local})
			}
        }
		for (let i = 0; i < sensors.length; i++) {
			s.push({id: sensors[i].id, l: sensors[i].Local})
			if (s[i].id == sensors[i].id) {
				s.pop()
			}
		}
		for (const sensor of sensors) {
			//s[Number(sensor.id)].temp.push(Number(sensor.Temperatura));
			console.log(sensor);
			
		}
		for (const sensor of sensors) {
			s.push({id: sensor.id, l: sensor.Local});
			//console.log(sensor);
			
		}
		for (let i = 0; i < sensors.length; i++) {
			a = 0;
			for (let i = 0; i < sensors.length; i++) {
				if (temps[a].l == sensors[i].Local) {
					temp[a].push()
				}
			}
			s.push({
				id: sensors[i].id, 
				l: sensor.Local
			});
		}
		res.render('sensors/showAll', {n : 'Todos os sensores', sensors: result.recordset});
	}
    
}
//Select s.Local,a.Temperatura from Sensor as s join Alerta as a on a.Sensor_Id = s.id;
//res.render('sensors/showAll', {n : 'Todos os sensores', sensors: result.recordset});