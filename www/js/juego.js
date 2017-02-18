var app = {
    inicio: function () {
	DIAMETRO_BOLA = 50;
	dificultad = 0;
	velocidadX=0;
	velocidadY=0;
	puntuacion=0;
	haColisionado = false; //para paso 2
	valorRojo = 0; //para paso 3
	
	alto = document.documentElement.clientHeight;
	ancho = document.documentElement.clientWidth;
	
	app.vigilaSensores();
	app.iniciaJuego();
		
	},
	
	iniciaJuego: function() {
		
		function preload() {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			
			game.stage.backgroundColor = 'rgb('+valorRojo+', 247, 247)';
			game.stage.alpha = 1;
			game.load.image('bola', 'assets/bola.png');
			game.load.image('objetivo', 'assets/objetivo.png');
			game.load.image('objetivo2', 'assets/objetivoNro2.png'); //linea creada por punto 1) Prueba Practica
		
		}
		
		function create() {
			scoreText = game.add.text(16,35, 'Score: '+puntuacion, { fontSize: '30px', fill: '#757676' });
					
			dificultadTxt = game.add.text(ancho-(ancho/3), 38, 'Dificultad: '+ dificultad, { fontSize: '15px', fill: '#757676' } ); // //linea creada por punto 3) Prueba Practica
			
			objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
			objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
			bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
			
			game.physics.arcade.enable(bola);
			game.physics.arcade.enable(objetivo);
			game.physics.arcade.enable(objetivo2); //linea creada por punto 1) Prueba Practica
		
			
			bola.body.collideWorldBounds = true;
			bola.body.onWorldBounds = new Phaser.Signal();
			bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
			bola.body.onWorldBounds.add( function(){
				//game.stage.backgroundColor = '#F8E0E0';
				game.stage.alpha = 0.1;
			}, this); //linea creada por punto 2) Prueba Practica
		}
		
		function update() {
			var factorDificultad = (100 + (dificultad*100));
			
			bola.body.velocity.y = (velocidadY * factorDificultad);
			bola.body.velocity.x = (velocidadX * (-1*factorDificultad));
			
			//game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
			game.physics.arcade.overlap(bola, objetivo, function() {
				app.incrementaPuntuacion();
				valorRojo = valorRojo+30;
				game.stage.backgroundColor = 'rgb('+valorRojo+', 247, 247)';
			}, null, this);
			game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntuacionDiez, null, this);//linea creada por punto 1) Prueba Practica
			
			/*para punto2: */
			if (haColisionado) {
				game.stage.backgroundColor = '#FE2E2E';
				haColisionado = false;
				}
				else
				{
				game.stage.backgroundColor = 'rgb('+valorRojo+', 247, 247)';
				}
		}
		
		var estados = {preload: preload, create: create, update: update};
		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
		
	},
	
	decrementaPuntuacion: function() {
		puntuacion = puntuacion-1;
		app.actualizarScore(puntuacion);
		haColisionado = true;
	},
	
	incrementaPuntuacion: function() {
		puntuacion = puntuacion+1;
		app.actualizarScore(puntuacion);
		
		objetivo.body.x = app.inicioX();
		objetivo.body.y = app.inicioY();
		
		
		
		if (puntuacion>=0){
			dificultad = dificultad + 1;
			dificultadTxt.text = 'Dificultad: ' + dificultad ;
		}
	},
	
	/*funcion creada por 1) de Prueba Practica:*/
	incrementaPuntuacionDiez: function() {
		puntuacion = puntuacion+10;
		app.actualizarScore(puntuacion);
		
		objetivo2.body.x = app.inicioX();
		objetivo2.body.y = app.inicioY();
				
		if (puntuacion>0){
			dificultad = dificultad + 1;
			dificultadTxt.text = 'Dificultad: ' + dificultad ;
		}
	},
	
	/*funcion creada para agrupar funcionalidad en comun:*/
	actualizarScore: function(score) {
		scoreText.text = 'Score: ' + score;
	},	
	
	inicioX: function() {
		return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
	},
	
	inicioY: function() {
		return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
	},
	
	numeroAleatorioHasta: function(limite){
		return Math.floor(Math.random() * limite);
	},
	
	vigilaSensores: function() {
		
		function onError() {
		console.log('onError!');
		}
		
		function onSuccess(datosAcel){
			app.detectaAgitacion(datosAcel);
			app.registraDireccion(datosAcel);
		}
		
		navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 10});
	},
	
	detectaAgitacion: function(datosAcel) {
		
		var agitacionX = datosAcel.x >10;
		var agitacionY = datosAcel.y > 10;
		
		if (agitacionX || agitacionY){
			setTimeout(app.recomienza, 1000);
		}
	},

	recomienza: function() {
		document.location.reload(true);
	},
	
	registraDireccion: function(datosAcel) {
		velocidadX = datosAcel.x;
		velocidadY = datosAcel.y;
	}
			
};
		
if ('addEventListener' in document){
	document.addEventListener('deviceready', function(){
		app.inicio();
	}, false);
}