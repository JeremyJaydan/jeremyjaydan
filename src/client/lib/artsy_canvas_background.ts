
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
