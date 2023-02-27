//TODO: gravity can be changed? or turned on and off
//TODO: when gravity exists a force must pull the object to the direction gravity is working.
//TODO: when dragging an object, the location the object is dragged from must affect the object correspondingly
//TODO: the longer the line, the greater the force 

//TODO: gravity can have a force number, and an angle or whatever number.
//TODO: maybe it is possible to do sort of 3d? fake ofcourse, objects can grow and shrink to simulate 3d. 
//TODO: use already made classes for square/rectangles, and create classes for other shapes and such, like circle, maybe stars and such

//TODO: from physics, arrows represent force, sum of forces to calculate direction and speed of object,
//when  collision is made, a force works on both the hit object, and the hitting object, equal force, with opposite direction of force.

class Rectangle {

    constructor(ctx, x_position, width, y_postion, height, color) {
      this.x_position = x_position;
      this.width = width
      this.y_postion = y_postion;
      this.height = height
      this.color = color;
      this.ctx = ctx;
  
      this.x_velocity = 0
      this.x_direction = 0
      this.y_velocity = 0
      this.y_direction = 0
    }
  
    draw() {
      this.x_position += this.x_velocity * this.x_direction
      this.y_postion += this.y_velocity * this.y_direction
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x_position, this.y_postion, this.width, this.height);
    }
  
    move(x_velocity, x_direction, y_velocity, y_direction){
      this.x_velocity = x_velocity
      this.x_direction = x_direction
      this.y_velocity = y_velocity
      this.y_direction = y_direction
    }
  
    grow(growth_margin){
      this.y_postion -= growth_margin        
      this.x_position -= growth_margin        
      this.width += growth_margin * 2        
      this.height += growth_margin * 2        
    }
  
    rectangle_collides_direction(obstacle_lower, obstacle_upper, dir){
  
      let rectangle_lower, rectangle_upper
      if (dir.toLowerCase() === "x"){
        rectangle_lower = this.x_position
        rectangle_upper = this.x_position + this.width
      }
      else if (dir.toLowerCase() === "y"){
        rectangle_lower = this.y_postion
        rectangle_upper = this.y_postion + this.height
      }
  
      if( object_collides(rectangle_lower, rectangle_upper, obstacle_lower, obstacle_upper)){
        return true
      }
      return false
    }
  
    get_values(){
        //TODO: should return all values?
        const x_position = this.x_position
        const y_postion = this.y_postion
        const x_direction = this.x_direction
        const y_direction = this.y_direction
        const width = this.width
        const height = this.height
        return {x_position, y_postion, x_direction, y_direction, width, height}
    }
}

var canvas
let ctx

window.onload = winInit;
function winInit() {

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

}


function v2a(vector1, vector2, unit) {
    const vector1_length = Math.sqrt(vector1[0] ** 2 + vector1[1] ** 2);
    const vector2_length = Math.sqrt(vector2[0] ** 2 + vector2[1] ** 2);

    if (vector1_length == 0 || vector2_length == 0) {
        return NaN;
    }
    const vector_product = vector1[0] * vector2[0] + vector1[1] * vector2[1];
    //angle as degrees
    if (unit == "deg") {
        const angle = (Math.acos(vector_product / (vector1_length * vector2_length)) * 180) / Math.PI;
        return angle;
    }

    //angle as radians
    else {
        const angle = Math.acos(vector_product / (vector1_length * vector2_length));
        return angle;
    }
}


