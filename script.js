//TODO: gravity can be changed? or turned on and off
//TODO: when gravity exists a force must pull the object to the direction gravity is working.
//TODO: when dragging an object, the location the object is dragged from must affect the object correspondingly
//TODO: the longer the line, the greater the force 

//TODO: gravity can have a force number, and an angle or whatever number.
//TODO: maybe it is possible to do sort of 3d? fake ofcourse, objects can grow and shrink to simulate 3d. 
//TODO: use already made classes for square/rectangles, and create classes for other shapes and such, like circle, maybe stars and such

//TODO: Can add weight
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

  //TODO: add method for acceleration

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

  change_x_direction(){
    this.x_direction *= -1
  }
  change_y_direction(){
    this.y_direction *= -1
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

class Collection_rectangles {

  constructor(){
    this.rectangles = []
  }

  draw_colliding_rectangles(){
    this.rectangles.forEach( rectangle => rectangle.draw() )
  }
  remove_rectangle(rectangle_id){
    this.rectangles.splice(rectangle_id, 1)
  }

  add_rectangle(rectangle){
    this.rectangles.push(rectangle)
  }
  
  add_random_rectangle(random_factor){

    if (random_factor){
      this.random_factor = random_factor
    }

    const random_color = create_hsl_expression( random_integer_in_range(0,256) , 75 , 50 )
    const lower_range = this.random_factor
    const upper_range = this.random_factor * random_integer_in_range(1, 4)
    const random_x_speed = random_integer_in_range(lower_range, upper_range)
    const random_y_speed = random_integer_in_range(lower_range, upper_range)
    const random_size = random_integer_in_range(this.random_factor*3, this.random_factor*10)
    let random_direction_x = 1;
    if ( Math.random() <= 0.5 ) { random_direction_x = -1; }

    const rectangle = new Rectangle(ctx, canvas.width/2, random_size , 10, random_size, random_color)
    rectangle.move(random_x_speed,random_direction_x,random_y_speed,1)
    this.rectangles.push(rectangle)
  }

  add_random_factor(random_factor){
    this.random_factor = random_factor
  }
}

//TODO: can create vectors by having [0, x1] and [0, y1] x1 and y1 are the objects velocity
//TODO: maybe have a function or something to create vectors.

//TODO: check first for potential collision, when it is possible,
// check for more specific collision, check pixels or whatever

let animation_id 
var canvas, ctx


window.onload = winInit;
function winInit() {

  const play_button = document.getElementById("play_button")
  const restart_button = document.getElementById("restart_button")

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  let paddle_speed

  play_button.addEventListener("click", function() {

    if (animation_id){ return }

    const random_factor = 5
    const canvas_width = 300
    const canvas_height = 600
    const paddle_width = 150
    paddle_speed = 20

    canvas.width = canvas_width
    canvas.height = canvas_height

    const ball_array = new Collection_rectangles()
    ball_array.add_random_factor(random_factor)
    ball_array.add_random_rectangle()
    
    const random_paddle_color = create_hsl_expression( random_integer_in_range(0,256) , 75 , 50 )
    const paddle = new Rectangle(ctx, canvas.width/2 - 75, paddle_width, canvas.height* 0.9, 20, random_paddle_color)
    
    animation_id = setInterval( function () { draw_multipong_game(canvas, paddle, ball_array) }, 1000 / 50);

    canvas.addEventListener("mousemove", function(event){ rectangle_mouse_handler(event, paddle) })
    document.addEventListener("keydown", function(event){ rectangle_key_handler(event, paddle, paddle_speed, 0) })
    document.addEventListener("keyup", function(event) { rectangle_key_handler(event, paddle, paddle_speed, 0) })
  })

  restart_button.addEventListener("click", function(){

    clear_all_intervals()
    draw_background(canvas, "black")
    animation_id = null

    canvas.removeEventListener("mousemove", function(event){ rectangle_mouse_handler(event, paddle) })
    document.removeEventListener("keydown", function(event){ rectangle_key_handler(event, paddle, paddle_speed, 0) })
    document.removeEventListener("keyup", function(event) { rectangle_key_handler(event, paddle, paddle_speed, 0) })
  })
}

//Creates balls, draws background and detects ball collision
function draw_multipong_game(canvas, paddle, balls) {

  draw_background(canvas, "black")
  draw_rectangle(canvas, paddle)
  draw_colliding_rectangles(canvas, balls, paddle)
  text_to_element(balls.rectangles.length - 1, score_element)
}

function rectangle_key_handler(event, rectangle, x_speed, y_speed){

  rectangle_info = rectangle.get_values()
  const rectangle_x_direction = rectangle_info.x_direction
  const rectangle_y_direction = rectangle_info.y_direction

  if (event.type === "keydown"){

    if (event.key === "ArrowLeft"){
      rectangle.move(x_speed, -1, 0, 0)
    }
    else if (event.key === "ArrowRight"){
      rectangle.move(x_speed, 1, 0, 0)
    }
    else if (event.key === "ArrowUp"){
      rectangle.move(0, 0, y_speed, -1)
    }
    else if (event.key === "ArrowDown"){
      rectangle.move(0, 0, y_speed, 1)
    }
  }

  if (event.type === "keyup") {

    if (event.key === "ArrowLeft" && rectangle_x_direction !== 1){
      rectangle.move(0, 0, 0, 0)
    }
    else if (event.key === "ArrowRight" && rectangle_x_direction !== -1){
      rectangle.move(0, 0, 0, 0)
    }
    else if (event.key === "ArrowUp" && rectangle_y_direction !== 1){
      rectangle.move(0, 0, 0, 0)
    }
    else if (event.key === "ArrowDown" && rectangle_y_direction !== -1){
      rectangle.move(0, 0, 0, 0)
    }
  }
}

function rectangle_mouse_handler(event, rectangle){

  rectangle_info = rectangle.get_values()
  const rectangle_width = rectangle_info.width
  const cursor_x_position = get_cursor_position(event)[0]
  rectangle.x_position = (cursor_x_position - rectangle_width/2) 
}

function draw_rectangle(canvas, rectangle){

  rectangle_info = rectangle.get_values()
  const rectangle_x1 = rectangle_info.x_position
  const rectangle_x2 = rectangle_info.x_position + rectangle_info.width
  const rectangle_direction = rectangle_info.x_direction

  if (rectangle_direction === 1 && rectangle_x2 >= canvas.width){
    rectangle.move(0,0,0,0)
  }
  else if (rectangle_direction === -1 && rectangle_x1 <= 0){
    rectangle.move(0,0,0,0)
  }
  rectangle.draw()
}

//TODO create a loop to check if obstacles get hit (incase of multiple obstacles, more general)
function draw_colliding_rectangles(canvas, rectangle_array, obstacle){

  obstacle_info = obstacle.get_values()
  const obstacle_x1 = obstacle_info.x_position
  const obstacle_x2 = obstacle_info.x_position + obstacle_info.width  
  const obstacle_y1 = obstacle_info.y_postion + obstacle_info.height
  const obstacle_y2 = obstacle_info.y_postion

  rectangle_array.draw_colliding_rectangles()
  
  for (let i = 0; i < rectangle_array.rectangles.length; i++) {

    const rectangle_x1 =  rectangle_array.rectangles[i].x_position + rectangle_array.rectangles[i].width
    const rectangle_x2 =  rectangle_array.rectangles[i].x_position
    const rectangle_y1 = rectangle_array.rectangles[i].height + rectangle_array.rectangles[i].y_postion

    //rectangle hits roof or floor
    if (rectangle_array.rectangles[i].rectangle_collides_direction( 0, canvas.height, "y" )){
      rectangle_array.rectangles[i].change_y_direction()      
    }

    //rectangle hits wall
    if (rectangle_array.rectangles[i].rectangle_collides_direction( 0, canvas.width, "x" )) {
      rectangle_array.rectangles[i].change_x_direction()      
    }

    // rectangle hits obstacle
    //TODO: first maybe check if object is hit at all, then find  the pixel which is hit? 
    //maybe finding the distance from the center of gravity to use 
    if ( rectangle_array.rectangles[i].rectangle_collides_direction( obstacle_y1, obstacle_y2, "y" ) && object_collides(obstacle_x1, obstacle_x2, rectangle_x1, rectangle_x2) ){
      rectangle_array.rectangles[i].change_y_direction()      
    }
  }
}

function death_drawing_rectangle(canvas, rectangle){

  growth_number = 1.01
  const grow_rectangle_interval_id = setInterval( function() {

    growth_number *= 1.1
    rectangle.grow(growth_number)
    rectangle.draw()
    //the growing rectangle fills the canvas
    if (rectangle.width > canvas.width*2.5 && rectangle.height > canvas.height* 2.5 ){
      
      clearInterval(grow_rectangle_interval_id)
      let i = 0
      const death_text_interval_id = setInterval( function() {

        i += 1
        const color = create_hsl_expression( i*3 , 75 , 50 )
        const text_height = largest_font_size(canvas, "You Are Dead!", "Monospace")
        const vertical_space = Math.ceil(canvas.height / text_height)
        fill_largest_font_centered(canvas, "You Are Dead!", "monospace", text_height*(i%vertical_space), color)
      }, 1000/50)
    }
  }, 1000/50)
}

//TODO: when done here, add the general functions (and classes?) from this library to my large library

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


