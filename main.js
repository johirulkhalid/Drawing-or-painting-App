const canvas = document.querySelector('canvas'),
toolBtns= document.querySelectorAll('.tool'),
fillColor= document.querySelector('#fill-color'),
sizeSlider= document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext('2d');


// third step global variable with default value
let prevMouseX, prevMouseY,snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setcanvasBg = () => {
    ctx.fillStyle = "#121212";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}
// second step
window.addEventListener('load', () => {
    //setting canvas withd/height.. offsetwidth/offsetheight returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setcanvasBg();
}); 
// draw rectangle
const drawRect = (e) => {
    // if isn't checked draw a rect with border else draw rect with background    
    if(!fillColor.checked){
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX,prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX,prevMouseY - e.offsetY);
    
}
// draw circle
const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw a circle
    // getting circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY),2));
    ctx.arc(prevMouseX, prevMouseY,radius,0,2 * Math.PI); //arc method used for make circle
    fillColor.checked ? ctx.fill() :  ctx.stroke(); //if fillColor is checked fill circle else draw border circle
}
// draw triangle
const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw a circle
    ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() :  ctx.stroke(); //if fillColor is checked fill triangle else draw border circle
}
// third step 
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; //passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selected color as stroke style
    ctx.fillStyle = selectedColor; // passing selected color as fill style
    snapshot = ctx.getImageData(0,0, canvas.width, canvas.height); //copying canvas data & passing as snashot value..this avoids dragging the image 
}


// first step
const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return from here 
    ctx.putImageData(snapshot,0,0); // adding copied data on to canvas
    if(selectedTool === "brush" || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#121212" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    }else if(selectedTool === "rectangle"){
        drawRect(e);
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }else{
        drawTriangle(e);
    }
};


// fourth step
toolBtns.forEach(btn => {
    btn.addEventListener('click', () => { //adding click event to all tool
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value); // passing slide value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => { //adding click event to all color button
         // removing active class from the previous option and adding on current clicked option
         document.querySelector(".options .selected").classList.remove('selected');
         btn.classList.add('selected');
        //  passing selected btn background color as selectedcolor value
         selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
})

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

// clear canvas
clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0,0, canvas.width, canvas.height); //clearing whole canvas
    setcanvasBg();
});

saveImg.addEventListener('click', () =>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL(); // passing canvas dataurl as href link
    link.click(); //clicking link to download image
})
canvas.addEventListener('mousedown', startDraw); // mouse click to draw
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => isDrawing = false);