/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do consign */
var consign = require('consign');

/* importar o módulo do body-parser */
var bodyParser = require('body-parser');

/* importar o módulo do express-validator */
var expressValidator = require('express-validator');

/* importar o módulo do express-session */
var expressSession = require('express-session');

/* iniciar o objeto do express */
var app = express();

//Recupera o modulo so socket.io e atrela o socket.io ao nosso servidor express.
var io = require('socket.io');

var config = require('./db')
var sql = require('mssql')


var users = [];
const PORT = process.env.PORT || 5000

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './app/views');
app.set('users', users);


/* configurar o middleware express.static */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));

/* configurar o middleware express-validator */
app.use(expressValidator());

/* configurar o middleware express-validator */
app.use(expressSession({
	secret: 'ardIno',
	resave: false,
	saveUninitialized: true
}));

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/routes')
	.then('app/models')
	.then('app/controllers')
	.into(app);

/* parametrizar a porta de escuta */
var server = app.listen(PORT, () => {	
	console.log(`Executando na porta ${ PORT }`)
	console.log('Servidor online e ativo');
})

var s = io(server);
seekLastTempHumi = (key)=>{
	return new Promise((resolve,reject)=>{
		console.log(key);
		sql.connect(config, err => {
			// ... error checks
		 
			// Query
			new sql.Request().query(`Select top 1 a.Temperatura, a.Umidade, a.Hora from  Historico as a , Sensor as s where a.Sensor_Id = s.id and Codigo ='${key}' order by a.id desc`, (err, result) => {
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
s.on('connection', (socket) => {//É mostrado quando alguem se conecta 

	socket.on('requestLastTH', (key)=>{	
		seekLastTempHumi(key)
		.then((th)=>{
			s.to(socket.id).emit('LastTempHumi',th);
		});
			
		
		//s.socket(socket.id).emit('LastTempHumi',th);
	})
	
})

/* exportar o objeto app */
module.exports = app;