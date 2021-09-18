var currentDragNode = null;			//which node is currently being dragged.
var offsetX = 0;					//where is the mouse pointer's x in relation to the node's x?
var offsetY = 0;					//where is the mouse pointer's y in relation to the node's y?

/*
	The dragReact function is left intentionally empty in this file because a progam using the drag manager will need to define what happens when an object is dragged.  In your code, simply redefine this function:
	
	dragReact = function(e)
	{
		//your code.
	}
	
	The parameter, "e", represents the event.
*/
dragReact = function(e){};			

/*
	In order for our drag manager to work, the document itself has to always be aware of mouse movement.  If the mouse moves, it needs to check if there is a currentDragNode that should move with it.
	
	This could be streamlined to work inside of container defined by a different element IF that element was predefined as NOT having static position AND had a width, height, left, and top.
*/
document.addEventListener("mousemove", function()
{
	var e = event;		//store the event object so that data is not lost if another event occurs.
	
	//if there's no currentDragNode, do nothing.
	if (currentDragNode == null)
		return;
	
	/*
		Move the currentDragNode to the position of the mouse.  The offset variables, keep the mouse in place so that the node doesn't jump to have its top and left match the mouse's position.
	*/
	currentDragNode.style.top = (e.clientY - offsetY) + "px";
	currentDragNode.style.left = (e.clientX - offsetX) + "px";
	
	/*
		If you have objects that need to do more on a drag than simply move around the screen, override the base of this function.
	*/
	dragReact(e);
});

/*
	makeDragNode
	
	This function is responsible for taking an HTML element and converting it into a draggable node.
	
	Parameters:
		el - the element.
		x - the starting x, or left, position of the element.
		y - the starting y, or top, position of the element.
*/
function makeDragNode(el, x, y)
{
	//if x and y are not specified, set them to 0.
	if (!x || x == null)
		x = 0;
	
	if (!y || y == null)
		y = 0;
	
	el.dragNode = true;					//a property to define the element as a dragNode.
	el.style.position = "absolute";		//in order to set positions, the positioning must be absolute.
	el.style.top = x + "px";
	el.style.left = y + "px";
	el.draggable = false;				//remove the browser's normal drag ability to prevent "ghosts".
	
	/*
		The mousedown event handles the "grabbing" portion of the drag.  If the mouse comes down on the element, it will store it as the currentDragNode and set the offsets based on where the element is positioned and where the mouse pointer is positioned.
	*/
	el.addEventListener("mousedown", function()
	{
		var e = event;
		
		currentDragNode = this;
		offsetX = event.clientX - parseInt(this.style.left);
		offsetY = event.clientY - parseInt(this.style.top);
	});
	
	/*
		The mouseup event handles the "release" portion of the drag.  If the mouse button is released over the element, the currentDragNode will be set to null, freeing the current element.
	*/
	el.addEventListener("mouseup", function()
	{
		currentDragNode = null;
	});
}