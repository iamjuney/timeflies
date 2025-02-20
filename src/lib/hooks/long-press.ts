import type { Action } from 'svelte/action';

/**
 * A Svelte action that adds long press detection to any element
 * @param node The HTML element to attach the action to
 * @param duration The duration in milliseconds before triggering the longpress event (default: 500ms)
 * @returns The action cleanup object
 *
 * Usage:
 * <button use:longpress={1000} on:longpress={handleLongPress}>Press and hold me</button>
 */
export const longpress: Action<
	HTMLElement,
	number | undefined,
	{
		onlongpress: (e: CustomEvent) => void;
	}
> = (node, duration = 500) => {
	let timer: ReturnType<typeof setTimeout>;
	let isLongPress = false;

	function handleStart(e: MouseEvent | TouchEvent) {
		isLongPress = false;
		timer = setTimeout(() => {
			isLongPress = true;
			node.dispatchEvent(new CustomEvent('longpress'));
		}, duration);
	}

	function handleEnd(e: MouseEvent | TouchEvent) {
		clearTimeout(timer);
		// If this was a long press, prevent the click event
		if (isLongPress) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	function handleClick(e: MouseEvent) {
		if (isLongPress) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	node.addEventListener('mousedown', handleStart);
	node.addEventListener('touchstart', handleStart, { passive: true });
	node.addEventListener('click', handleClick);
	node.addEventListener('mouseup', handleEnd);
	node.addEventListener('mouseleave', handleEnd);
	node.addEventListener('touchend', handleEnd);
	node.addEventListener('touchcancel', handleEnd);

	return {
		destroy() {
			clearTimeout(timer);
			node.removeEventListener('mousedown', handleStart);
			node.removeEventListener('touchstart', handleStart);
			node.removeEventListener('click', handleClick);
			node.removeEventListener('mouseup', handleEnd);
			node.removeEventListener('mouseleave', handleEnd);
			node.removeEventListener('touchend', handleEnd);
			node.removeEventListener('touchcancel', handleEnd);
		}
	};
};
