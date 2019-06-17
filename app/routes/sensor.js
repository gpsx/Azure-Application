var config = require('../../config/db')
var sql = require('mssql')

module.exports = function (application) {

	var shar = "abcdefghijklmnopqrstuvwxyz1234567890";
	var letters = shar.split('');
	var code = '';
	var sensors;

	application.get('/sensors', async (req, res) => {
		searchSensors(req, res);
	})

	application.get('/sensors/add', async (req, res) => {
		res.render('sensors/add', { n: 'Sensores', user: req.session.user[0] });
	})

	application.post('/sensors/register', (req, res) => {
		addSensor(req.body, req, res);
	})
	application.get('/sensors/detail/:id', function (req, res, next) {
		console.log('ID:', req.params.id);
		searchSensor(req, res, req.params.id);
	});

	randomChar = (limit, l) => {
		c = '';
		for (let i = 0; i < limit; i++) {
			c += l[(Math.random() * (l.length - 1)).toFixed(0)];
		}
		return c;
	};
	addSensor = (sensor, req, res) => {
		code = randomChar(15, letters);
		console.log(code);
		sql.connect(config, err => {
			// ... error checks
			const request = new sql.Request()
			request.stream = true // You can set streaming differently for each request
			request.query(`insert into Sensor(TempMax, TempMin, UmidMax, UmidMin, Codigo, Cliente_id, Local) 
			values
				('${sensor.maxTemp}', '${sensor.minTemp}', '${sensor.maxUmid}', '${sensor.minUmid}', '${code}', '${sensor.Cliente_Id}', '${sensor.local}')`) // or request.execute(procedure)

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
	searchSensors = (req, res) => {
		sql.connect(config).then(() => {
			return sql.query`Select s.Cliente_Id, s.Local, s.Codigo, s.id, a.Temperatura from Sensor as s left join Historico as a on a.Sensor_Id = s.id and Cliente_Id = ${req.session.user[0].Cliente_Id} order by a.Sensor_Id`
		}).then(result => {
			sql.close();
			console.log(result.recordset);

			assocTemp(req, res, result.recordset);

		}).catch(err => {
			console.log(err);
			sql.close()
			res.send('Falha ao estabelecer conexão com o banco');
		});
	}
	assocTemp = (req, res, sensors) => {
		ss = [];
		for (let i = 0; i < sensors.length; i++) {

			if (sensors[i].Cliente_Id == req.session.user[0].Cliente_Id) {
				if (ss.length == 0) {

					ss.push({
						id: sensors[i].id,
						l: sensors[i].Local,
						key: sensors[i].Codigo,
						temps: []
					});
					console.log(ss, i);

				} else if (ss[ss.length - 1].id != sensors[i].id) {

					ss.push({
						id: sensors[i].id,
						l: sensors[i].Local,
						key: sensors[i].Codigo,
						temps: []
					})
				}
			}
			for (const s of ss) {
				for (const sensor of sensors) {
					if (s.id == sensor.id) {
						s.temps.push(sensor.Temperatura);
					}
				}
			}
			for (const s of ss) {
				while (s.temps.length > 10) {
					s.temps.shift();
				}
			}
		}
		console.log(ss);
		res.render('sensors/showAll', { n: 'Todos os sensores', sensors: ss });
	}
	searchSensor = (req, res, key) => {
		sql.connect(config).then(() => {
			return sql.query`Select s.*, h.Temperatura , h.Umidade, h.DataDMA, h.Hora from Sensor as s join Historico as h on h.Sensor_Id = s.id and Codigo = ${key}`
		}).then(result => {
			sql.close();
			console.log(result.recordset);

			assocSensorDetail(req, res, result.recordset);

		}).catch(err => {
			console.log(err);
			sql.close()
			res.send('Falha ao estabelecer conexão com o banco');
		});
	}

	assocSensorDetail = (req, res, sensors) => {
		th = [];
		console.log(sensors);

		for (let i = 0; i < sensors.length; i++) {
			th.push({
				id: sensors[i].Id,
				l: sensors[i].Local,
				key: sensors[i].Codigo,
				tMax: sensors[i].TempMax,
				tMin: sensors[i].TempMin,
				hMax: sensors[i].UmidMax,
				hMin: sensors[i].UmidMin,
				temps: [],
				umis: [],
				dataDMA: [],
				Hora: [],
				TopT: [],
				TopU: [],
				topHora: []
			});
			break;
		}
		for (const s of th) {
			for (const sensor of sensors) {
				if (s.id == sensor.Id) {
					s.temps.push(sensor.Temperatura);
					s.umis.push(sensor.Umidade);
					s.TopT.push(sensor.Temperatura);
					s.TopU.push(sensor.Umidade);
					s.dataDMA.push(sensor.DataDMA);
					s.Hora.push(sensor.Hora);
					s.topHora.push(sensor.Hora);
				}
			}
		}
		for (const s of th) {
			while (s.TopT.length > 10) {
				s.TopT.shift();
				s.TopU.shift();
				s.topHora.shift();
			}
		}
		console.log(th);
		res.render('sensors/sensorDetail', { n: `Sensor - ${th[0].l}`, sensor: th[0], bigData: sensors });

	};

}
//Select s.Local,a.Temperatura from Sensor as s join Alerta as a on a.Sensor_Id = s.id;
//res.render('sensors/showAll', {n : 'Todos os sensores', sensors: result.recordset});