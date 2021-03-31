const game = {          	// Глобальная переменная
	ctx: undefined,			// Контекст
	sprites: {
		background: undefined,
		ball: undefined,
		needle: undefined,
	},
	init: function () {
		const canvas = document.getElementById('canvas');
		this.ctx = canvas.getContext("2d");
		window.addEventListener("keydown", function (e) {
			if (e.keyCode == 37) {
				game.needle.dx = -game.needle.velociti;
			} else if (e.keyCode == 39) {
				game.needle.dx = game.needle.velociti;
			}
		});
	},
	load: function () {
		for (let key in this.sprites) {
			this.sprites[key] = new Image();
			this.sprites[key].src = 'images/' + key + '.png';										// Загружаем из объекта sprites картинки для отрисовки
		}
	},
	create: function () {

	},
	start: function () {
		this.init();
		this.load();
		this.create();
		this.run();
	},
	render: function () { 																		// Рендерим наши объекты
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.drawImage(this.sprites.background, 0, 0);										// фон
		this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y, 30, 40);									// шар
		this.ctx.drawImage(this.sprites.needle, this.needle.x, this.needle.y, 80, 40);			// игла
	},
	update: function () {
		if (this.needle.dx) {
			this.needle.move();
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

game.needle = {
	x: 400,
	y: 0,
	velociti: 6,
	dx: 0,
	move: function () {
		this.x += this.dx;
	}
}
game.ball = {
	x: 400,
	y: 400,
}

window.addEventListener('load', function () {
	game.start();
})