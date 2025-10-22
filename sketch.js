let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Color mode and initial aesthetic
  colorMode(RGB, 255, 255, 255, 1);
  background(0);
}

function draw() {
  // Semi-transparent background for trail effect
  background(0, 0, 0, 0.1);
  
  // Update and display fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    
    // Remove expired fireworks
    if (fireworks[i].isDone()) {
      fireworks.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Create multiple fireworks on click
  let fireworkCount = floor(random(3, 7));
  for (let i = 0; i < fireworkCount; i++) {
    fireworks.push(new Firework(mouseX, mouseY));
  }
}

class Firework {
  constructor(originX, originY) {
    // Diwali-inspired red and yellow color palette
    this.colors = [
      { r: 255, g: 69, b: 0 },    // Bright Red
      { r: 255, g: 165, b: 0 },   // Bright Yellow-Orange
      { r: 255, g: 0, b: 0 },     // Pure Red
      { r: 255, g: 215, b: 0 }    // Golden Yellow
    ];
    
    // Launch point near mouse click with slight variation
    this.x = originX + random(-50, 50);
    this.y = originY + random(-50, 50);
    
    // Color and intensity based on click
    this.color = random(this.colors);
    
    // Firework launch parameters with random variation
    this.velocity = createVector(
      random(-2, 2), 
      random(-10, -15)
    );
    this.acceleration = createVector(0, 0.2);
    
    // Particles for explosion
    this.particles = [];
    this.exploded = false;
  }
  
  update() {
    // Move firework if not exploded
    if (!this.exploded) {
      this.velocity.add(this.acceleration);
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      
      // Explode at peak
      if (this.velocity.y >= 0) {
        this.explode();
      }
    }
    
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      
      // Remove faded particles
      if (this.particles[i].isDone()) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  explode() {
    this.exploded = true;
    // Consistent particle count with some randomness
    let particleCount = floor(random(50, 100));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }
  
  display() {
    if (!this.exploded) {
      // Draw firework before explosion
      noStroke();
      fill(this.color.r, this.color.g, this.color.b);
      ellipse(this.x, this.y, 5, 5);
    }
    
    // Display particles
    this.particles.forEach(p => p.display());
  }
  
  isDone() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, particleColor) {
    this.pos = createVector(x, y);
    this.color = particleColor;
    
    // Explosion spread with random variation
    let angle = random(TWO_PI);
    let magnitude = random(2, 6);
    this.velocity = p5.Vector.fromAngle(angle, magnitude);
    
    this.acceleration = createVector(0, 0.05);
    this.lifespan = random(200, 255);
  }
  
  update() {
    this.velocity.add(this.acceleration);
    this.pos.add(this.velocity);
    this.lifespan -= 5;
  }
  
  display() {
    noStroke();
    // Fade out particles
    fill(
      this.color.r, 
      this.color.g, 
      this.color.b, 
      this.lifespan / 255
    );
    ellipse(this.pos.x, this.pos.y, 3, 3);
  }
  
  isDone() {
    return this.lifespan <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
