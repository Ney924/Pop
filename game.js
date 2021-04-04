const params = {                                                                                        // Базовые параметры игры        
   width: 800,
   height: 600,
   widthBall: undefined,
   heightBall: undefined,
   widthNeedle: 80,
};

const state = {                                                                                          //! State
   balls: [],
   needle: {
      x: 360,
      y: 0,
      dx: 0,
      velocity: 6,
      move: function () {
         this.x += this.dx;
      },
      stop: function () {
         this.dx = 0;
      }
   },
   scoreWin: 0,
   scoreLoose: 0,
   time: 10,
   coef: 1,
   breeze: undefined,
};

const ballSize = function () {                                                                           // Генерируем случайные размеры для шаров
   params.widthBall = Math.round(Math.random() * (7 - 3) + 3) * 10;
   params.heightBall = params.widthBall * 1.3;
}

const speedWind = function () {
   state.breeze = (Math.random() * 3 - Math.random() * 3)
}

const sprites = {
   background: undefined,
   ball: [],
   needle: undefined,
};

const init = function () {
   const canvas = document.getElementById('canvas');
   ctx = canvas.getContext("2d");
   ctx.fillStyle = '#fff';
   ctx.font = "18px Verdana";
   window.addEventListener("keydown", function (e) {                          // Управление иглой
      if (e.keyCode == 37 && state.needle.x < 0) {
         state.needle.x = 0;
      }
      else if (e.keyCode == 39 && state.needle.x > 720) {
         state.needle.x = 720;
      }
      else if (e.keyCode == 37) {
         state.needle.dx = -state.needle.velocity;
      }
      else if (e.keyCode == 39) {
         state.needle.dx = state.needle.velocity;
      }
   });
   window.addEventListener("keyup", function (e) {
      state.needle.stop();
   });
};

const load = function () {                                                                                // Загружаем из объекта sprites картинки для отрисовки
   sprites.background = new Image();                                                                           
   sprites.background.src = 'images/background.png';
   sprites.ball[0] = new Image();
   sprites.ball[0].src = 'images/ball.png';
   sprites.ball[1] = new Image();
   sprites.ball[1].src = 'images/ball1.png';
   sprites.ball[2] = new Image();
   sprites.ball[2].src = 'images/ball2.png';
   sprites.ball[3] = new Image();
   sprites.ball[3].src = 'images/ball3.png';

   sprites.needle = new Image();
   sprites.needle.src = 'images/needle.png';
};

const createBall = function () {                                                                           //Создаём шарики в массиве шары в state 
   if (state.time > 0 && state.time % 3 == 0) {
      state.balls.push({
         x: Math.random() * (params.width - params.widthBall),
         y: params.height,
         dx: 0,
         dy: -((Math.random() * ((2 - 1.5)) + 1.5) * state.coef),
         dell: false,
         color: Math.round(Math.random() * 3),
         sizeWidth: params.widthBall,
         sizeHeight: params.heightBall,
         flight: function () {
            this.y += this.dy;
         },
         wind: function () {
            this.x += this.dx;
         }
      })
   }
};

const wind = function () {                                                                                  // Задаём ограничения для ветра
   for (ball in state.balls) {
      if (state.time % 3 == 0 &&
         state.balls[ball].x <= (params.width - state.balls[ball].sizeWidth) &&
         state.balls[ball].x >= 0) {
         if (state.breeze >= 0) {
            state.balls[ball].dx = 0.2 + state.breeze * ((800 - state.balls[ball].x) / 1000);
         } else {
            state.balls[ball].dx = -0.2 + state.breeze * (state.balls[ball].x / 1000);
         }
      }
      else {
         state.balls[ball].dx = 0;
      }

   }
}

const dellBall = function () {                                                                              //? Удаление шариков
   for (let j = 0; j < state.balls.length; j++) {

      if (state.balls[j].y < -100) {                                                                        // Удаление улетевших шариков
         state.balls.splice(j, 1);
         state.scoreLoose += 1
      }
      let needleCenter = state.needle.x + params.widthNeedle / 2

      if ((needleCenter < state.balls[j].x + params.widthBall) &&
         needleCenter > state.balls[j].x && (state.balls[j].y < 38 &&
            state.balls[j].y > 28)) {
         state.balls.splice(j, 1) && (state.scoreWin += 1);              // Кол-во лопнувших шариков
      };
   }
};

const startTime = function () {
   if (state.time > 0) {
      setInterval(() => {
         state.time -= 1;
         state.coef += 0.015;
      }, 1000)
   } else {
      state.time = 0;
   }
}

const stopTime = function () {
   if (state.time == 0) {
      const endGame = document.getElementById('end');
      endGame.style.display = 'grid';
      //alert('Игра окончена, ваш счёт: ' + state.scoreWin)
   }
}

const timeWind = function () {
   if (state.time > 0 && state.time % 3 == 0) {
      setInterval(() => {
         state.breeze = 0;
         speedWind();
         wind();
      }, 3000)
   }
}

const render = function () {                                                                                  //! Рендерим все наши объекты
   ctx.clearRect(0, 0, params.width, params.height);
   ctx.drawImage(sprites.background, 0, 0);
   ctx.drawImage(sprites.needle, state.needle.x, state.needle.y, 80, 40);
   for (let i = 0; i < state.balls.length; i++) {
      ctx.drawImage(sprites.ball[state.balls[i].color],
         state.balls[i].x,
         state.balls[i].y,
         state.balls[i].sizeWidth,
         state.balls[i].sizeHeight
      );
   };
   ctx.fillText('Время до окончания : ' + state.time, 500, 550);
   ctx.fillText('Лопнули шариков!!! : ' + state.scoreWin, 500, 570);
   ctx.fillText('Упустили(( : ' + state.scoreLoose, 500, 590);

};

const update = function () {
   if (state.needle.dx) {
      state.needle.move();
   }
   for (let i = 0; i < state.balls.length; i++) {
      if (state.balls[i].dy) {
         state.balls[i].flight();
      }
      if (state.balls[i].dx) {
         state.balls[i].wind();
      }
   }
};

const start = function () {
   const endGame = document.getElementById('end');
   endGame.style.display = 'none';
   state.scoreLoose = 0;
   state.scoreWin = 0;
   state.time = 10;
   state.coef = 1,
   init();
   load();
   createBall();
   dellBall();
   ballSize();
   startTime();
   speedWind();
   wind();
   timeWind();
   run();
   stopTime();
};

let date = new Date();

const run = function () {
   update();
   dellBall();
   wind();
   ballSize();
   stopTime();
   if (new Date() - date > 500) {
      createBall();
      date = new Date();
   }
   render();
   window.requestAnimationFrame(run);
};

window.addEventListener('load', function () {
   start();
})