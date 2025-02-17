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

	function handleStart() {
		timer = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress'));
		}, duration);
	}

	function handleEnd() {
		clearTimeout(timer);
	}

	node.addEventListener('mousedown', handleStart);
	node.addEventListener('touchstart', handleStart);
	node.addEventListener('mouseup', handleEnd);
	node.addEventListener('mouseleave', handleEnd);
	node.addEventListener('touchend', handleEnd);
	node.addEventListener('touchcancel', handleEnd);

	return {
		destroy() {
			clearTimeout(timer);
			node.removeEventListener('mousedown', handleStart);
			node.removeEventListener('touchstart', handleStart);
			node.removeEventListener('mouseup', handleEnd);
			node.removeEventListener('mouseleave', handleEnd);
			node.removeEventListener('touchend', handleEnd);
			node.removeEventListener('touchcancel', handleEnd);
		}
	};
};
