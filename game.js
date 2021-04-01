const params = {
	width: 800,
	height: 600,
	widthBall: 30,
};

const game = {          																		// Глобальная переменная
	ctx: undefined,																				// Контекст
	sprites: {
		background: undefined,
		ball: undefined,
		needle: undefined,
	},
	state: {																					// Физика
		balls: [],
		needle: {
			x: 360,
			y: 0,
			velocity: 6,
			dx: 0,
			move: function () {
				this.x += this.dx;
			},
			stop: function () {
				this.dx = 0;
			}
		}
	},

	init: function () {
		const canvas = document.getElementById('canvas');
		this.ctx = canvas.getContext("2d");
		window.addEventListener("keydown", function (e) {
			if (e.keyCode == 37) {
				game.state.needle.dx = -game.state.needle.velocity;
			} else if (e.keyCode == 39) {
				game.state.needle.dx = game.state.needle.velocity;
			}
		});
		window.addEventListener("keyup", function (e) {
			game.state.needle.stop();
		});
	},

	load: function () {

		this.sprites.background = new Image();
		this.sprites.background.src = 'images/background.png';									// Загружаем из объекта sprites картинки для отрисовки

		this.sprites.ball = new Image();
		this.sprites.ball.src = 'images/ball.png';												// Загружаем из объекта sprites картинки для отрисовки

		this.sprites.needle = new Image();
		this.sprites.needle.src = 'images/needle.png';											// Загружаем из объекта sprites картинки для отрисовки

	},

	createBall: function () {
		for (let i = 0; i <= 2; i++) {
			this.state.balls.push({
				x: Math.random() * (params.width - params.widthBall - 0),
				y: 300,
				dy: -2,
				flight: function () {
					this.y += this.dy;
				}
			})

		}
	},

	start: function () {
		this.init();
		this.load();
		this.createBall();
		this.spawnInteral();
		this.run();
	},

	render: function () { 																					// Рендерим наши объекты
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.drawImage(this.sprites.background, 0, 0);
		this.ctx.drawImage(this.sprites.needle, this.state.needle.x, this.state.needle.y, 80, 40);
		for (let i = 0; i < this.state.balls.length; i++) {
			this.ctx.drawImage(this.sprites.ball, this.state.balls[i].x, this.state.balls[i].y, 30, 40);
		}
	},

	spawnInteral: function () {
		setInterval( this.createBall, 3000)
	},

	update: function () {
		if (this.state.needle.dx) {
			this.state.needle.move();
		}
		for (let i = 0; i < this.state.balls.length; i++) {
			if (this.state.balls[i].dy) {
				this.state.balls[i].flight();
			}
		}
	},

	run: function () {
		this.update();
		this.render();
		window.requestAnimationFrame(function () {
			game.run();
		})
	},
};

window.addEventListener('load', function () {
	game.start();
})