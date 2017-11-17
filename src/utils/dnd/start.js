const noop = () => {}

const stopEvent = e => {
	e.preventDefault();
	e.stopPropagation();
};

const moving = (mover, e) => {
	mover.x += e.pageX - mover.mouseX;
	mover.y += e.pageY - mover.mouseY;
};

const clone = mover => {
	const node = mover.node,
		box = node.getBoundingClientRect(),
		style = window.getComputedStyle(node),
		avatar = node.cloneNode(true);

	mover.x = box.left - parseFloat(style.marginLeft) + window.pageXOffset;
	mover.y = box.top  - parseFloat(style.marginTop)  + window.pageYOffset;

	avatar.style.position = 'absolute';
	avatar.style.height = style.height;
	avatar.style.width = style.width;
	avatar.style.left = mover.x + 'px';
	avatar.style.top = mover.y + 'px';

	avatar.classList.remove('dnd-dragged');
	avatar.classList.add(mover.options.avatarClass || 'dnd-avatar');

	node.ownerDocument.body.appendChild(avatar);

	return avatar;
};

class Move {
	constructor (container, options, node, e) {
		this.container = container;
		this.options = options;
		this.node = node;

		// handle the state
		this.container.classList.add('dnd-dragged-container');
		this.node.ownerDocument.documentElement.classList.add('dnd-in-flight');
		this.node.classList.add('dnd-dragged');

		this.mouseX = e.pageX;
		this.mouseY = e.pageY;

		this.avatar = (options.makeAvatar || clone)(this);
		this.moving = options.moving || moving;
		this.over = options.over || noop;

		this.handles = [
			on(node.ownerDocument, 'mouseup', this.done.bind(this)),
			on(node.ownerDocument, 'mousemove', this.move.bind(this)),
			on(node.ownerDocument, 'dragstart', stopEvent),
			on(node.ownerDocument.body, 'selectstart', stopEvent)
		];

		(this.options.init || noop)(this);
	}

	destroy () {
		this.handles.forEach(h => h.remove());
		this.handles = [];

		// handle the state
		this.container.classList.remove('dnd-dragged-container');
		this.node.ownerDocument.documentElement.classList.remove('dnd-in-flight');
		this.node.classList.remove('dnd-dragged');
		if (this.previousOverItem) {
			this.previousOverItem.classList.remove('dnd-over');
		}

		(this.options.destroy || noop)(this);
	}

	done (e) {
		stopEvent(e);
		(this.options.drop || noop)(this);
		this.avatar.parentNode.removeChild(this.avatar);
		this.destroy();
	}

	move (e) {
		stopEvent(e);
		this.moving(this, e);
		this.mouseX = e.pageX;
		this.mouseY = e.pageY;
		this.avatar.style.left = this.x + 'px';
		this.avatar.style.top  = this.y + 'px';
		this.over(this);
	}
};

const formNode = {a: 1, input: 1, select: 1, button: 1, textarea: 1, option: 1};

const process = (container, options) => (e, node) => {
	node = node || e.target;
	if (!e.button && formNode[node.tagName.toLowerCase()] !== 1 && !node.classList.contains('dnd-ignore')) {
		new Move(container, options, node, e);
		stopEvent(e);
	}
};

const start = (container, options) => {
	options = options || {};
	const callback = process(container, options),
		filter = options.filter || '.dnd-item';
	return on(container, 'mousedown', filter, callback);
};

export default start;
