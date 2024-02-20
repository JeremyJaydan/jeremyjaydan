
export default class ArtsyCanvasBackground extends HTMLElement {
  
  static MAX_PARTICLES = 100;
  
  particles = [];
  mouse = {
    x: 0,
    y: 0,
    down: false
  };
  
  constructor(){
    super();
    this.attachShadow({ mode: 'open' });
    this.#render();
    window.addEventListener('resize', this.#onWindowResize.bind(this));
    window.addEventListener('mousemove', this.#onWindowMouseMove.bind(this));
    window.addEventListener('mousedown', () => this.mouse.down = true);
    window.addEventListener('mouseup', () => this.mouse.down = false);
    setTimeout(this.#init.bind(this), 1);
  }
  
  getCanvas(): HTMLCanvasElement {
    return this.shadowRoot!.querySelector('canvas') as HTMLCanvasElement;
  }
  
  #init(){
    this.#syncCanvasSize();
    
    const self = this;
    const canvas = this.getCanvas();
    const ctx = this.getCanvas().getContext('2d')!;
    
    (function draw(){
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      
      self.particles.forEach(particle => particle.draw(ctx));
      
      requestAnimationFrame(draw);
    })();
    
    for(let i = 0; i < this.constructor.MAX_PARTICLES; i++){
      this.particles.push(this.#createParticle(canvas));
    }
    
  }
  
  #createParticle(canvas){
    
    let x = Math.random() * canvas.offsetWidth;
    let y = Math.random() * canvas.offsetHeight;
    
    let radius = 5;
    let speedX = Math.random() * 2 - 1;
    let speedY = Math.random() * 2 - 1;
    
    const colorData = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255
    };
    const fillStyle = `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, 0.8)`;
    const secondaryFillStyle = `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, 0.1)`;
    
    const draw = ctx => {
      
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = secondaryFillStyle;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      if(x > canvas.offsetWidth || x < 0){
        speedX = -speedX;
      }
      
      if(y > canvas.offsetHeight || y < 0){
        speedY = -speedY;
      }
      
      x += speedX;
      y += speedY;
      
      let dx = x - this.mouse.x;
      let dy = y - this.mouse.y;
      
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if(distance < 100){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.strokeStyle = fillStyle;
        ctx.stroke();
      }
      
      if(distance < 100 && this.mouse.down){
        x -= dx * 0.05;
        y -= dy * 0.05;
      }
      
    }
    
    return { draw };
  }
  
  #syncCanvasSize(){
    const canvas = this.getCanvas();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  #onWindowResize(event: Event){
    this.#syncCanvasSize()
  }
  
  #onWindowMouseMove(event: MouseEvent){
    this.mouse.x = event.pageX;
    this.mouse.y = event.pageY;
  }
  
  #render(){
    this.shadowRoot!.innerHTML = /*html*/ `
    
      <style>
        canvas{}
      </style>
    
      <canvas></canvas>
      
    `;
  }
  
}

customElements.define('artsy-canvas-background', ArtsyCanvasBackground);







// const $ = q => {
//   let elements = document.querySelectorAll(q);
//   return elements.length > 1 ? elements : elements[0];
// }

// function Canvas(query, {resize, events, data, frame}){
//   let canvas = $(query);
//   let canvasCTX = canvas.getContext("2d");
  // if(resize){
  //   resize.apply(canvas);
  //   window.addEventListener("resize", () => resize.call(canvas));
  // }
//   if(events && events.constructor === Object){
//     Object.keys(events).forEach(key => {
//       let eventCallback = events[key];
//       canvas.addEventListener(key, e => eventCallback.call(canvas, e));
//     });
//   }
//   if(frame){
//     function loop(){
//       canvasCTX.clearRect(0, 0, canvas.width, canvas.height);
//       frame.call(canvas, canvasCTX);
//       requestAnimationFrame(loop);
//     }
//     setTimeout(loop, 1);
//   }
//   if(data) canvas.data = data;
//   return canvas;
// }

// const amountOfBalls = 1000;
// const balls = [];
// const colors = ["#79787A", "#7DA6DE"];

// function Ball({x, y, radius}){
  
//   this.x = x - radius;
//   this.y = y - radius;
//   this.radius = radius;
//   this.bounds = 150;
//   this.drag = Math.random() * 15;
  
//   let minSpeed = -this.drag;
//   let maxSpeed = this.drag;
  
//   this.speedX = minSpeed + ((Math.random() * maxSpeed) * 2);
//   this.speedY = minSpeed + ((Math.random() * maxSpeed) * 2);
  
//   this.color = colors[Math.floor(Math.random() * colors.length)];
//   this.draw = ctx => {
//     ctx.fillStyle = this.color;
    
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//     ctx.fill();
    
//     if(
//       (this.x > mouse.x - this.bounds && this.x < mouse.x + this.bounds) &&
//       (this.y > mouse.y - this.bounds && this.y < mouse.y + this.bounds) || mouse.down
//     ){
      
//       this.yDistance = Math.abs(mouse.y - this.y);
//       this.xDistance = Math.abs(mouse.x - this.x);
//       if(this.x > mouse.x) this.x -= this.xDistance / this.drag; else this.x += this.xDistance / this.drag;
//       if(this.y > mouse.y) this.y -= this.yDistance / this.drag; else this.y += this.yDistance / this.drag;
      
//     }else{
      
      
      
//       if(this.x > canvas.width - (this.radius * 2) || this.x < this.radius * 2){
//         this.speedX = -this.speedX;
//       }else{
//         this.x += this.speedX;
//       }
//       if(this.y > canvas.height - (this.radius * 2) || this.y < this.radius * 2){
//         this.speedY = -this.speedY;
//       }else{
//         this.y += this.speedY;
//       }
      
//     }
    
//   }
  
// }

// const mouse = {
//   down: false,
//   x: null,
//   y: null
// };

// const canvas = new Canvas("canvas", {
//   resize(){
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;
//   },
//   frame(ctx){
    
//     ctx.fillStyle = "#fff";
//     balls.forEach(ball => ball.draw(ctx));
    
//   },
//   events: {
//     mousemove(e){
//       mouse.x = e.pageX;
//       mouse.y = e.pageY;
//     },
//     mousedown(){
//       mouse.down = true;
//     },
//     mouseup(){
//       mouse.down = false;
//     }
//   }
// });

// for(let i = 0; i < amountOfBalls; i++){
//   balls.push(new Ball({
//     x: canvas.width / 2,
//     y: canvas.height / 2,
//     radius: Math.random() * 4
//   }))
// }




