const params = {
	width: 800,
	height: 600,
	widthBall: 30,
};
        																		// Глобальная переменная																				// Контекст
const sprites = {
	background: undefined,
	ball: undefined,
	needle: undefined,
};

const state = {																					// Физика
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
};

const init = function () {
	const canvas = document.getElementById('canvas');
	ctx = canvas.getContext("2d");
	window.addEventListener("keydown", function (e) {
		if (e.keyCode == 37) {
			state.needle.dx = -state.needle.velocity;
		} else if (e.keyCode == 39) {
			state.needle.dx = state.needle.velocity;
		}
	});
	window.addEventListener("keyup", function (e) {
		state.needle.stop();
	});
};

const load = function () {
	sprites.background = new Image();
	sprites.background.src = 'images/background.png';									// Загружаем из объекта sprites картинки для отрисовки

	sprites.ball = new Image();
	sprites.ball.src = 'images/ball.png';												// Загружаем из объекта sprites картинки для отрисовки

	sprites.needle = new Image();
	sprites.needle.src = 'images/needle.png';											// Загружаем из объекта sprites картинки для отрисовки
};

const createBall = function () {
	state.balls.push({
		x: Math.random() * (params.width - params.widthBall - 0),
		y: params.height,
		dy: -2,
		flight: function () {
			this.y += this.dy;
		}
	})
};

const start = function () {
	init();
	load();
	createBall();
	run();
};

const render = function () { 																					// Рендерим наши объекты
	ctx.clearRect(0, 0, params.width, params.height);
	ctx.drawImage(sprites.background, 0, 0);
	ctx.drawImage(sprites.needle, state.needle.x, state.needle.y, 80, 40);
	for (let i = 0; i < state.balls.length; i++) {
		ctx.drawImage(sprites.ball, state.balls[i].x, state.balls[i].y, 30, 40);
	}
};

const update = function () {
	if (state.needle.dx) {
		state.needle.move();
	}
	for (let i = 0; i < state.balls.length; i++) {
		if (state.balls[i].dy) {
			state.balls[i].flight();
		}
	}
};

let date = new Date();

const run = function () {
	update();
	if (new Date() - date > 500){
		createBall();
		date = new Date();
	}
	render();
	window.requestAnimationFrame(run);
};

window.addEventListener('load', function () {
	start();
})