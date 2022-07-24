class DragController {
  constructor(element) {
	this.element = element;
	this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  onMouseDown(event) {
	event.preventDefault();
	this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
	this.element.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseMove(event) {
	this.element.style.left = event.clientX + 'px';
	this.element.style.top = event.clientY + 'px';
  }

  onMouseUp(event) {
	this.element.removeEventListener('mousemove', this.onMouseMove.bind(this));
	this.element.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
}

export default DragController;