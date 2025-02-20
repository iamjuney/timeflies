<script>
	import { browser } from '$app/environment';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	const controlsLayout = [
		'previousFrame',
		'playpause',
		'stop',
		'nextFrame',
		'progress',
		'frame',
		'loop',
		'spacer',
		'background',
		'snapshot',
		'zoom',
		'info'
	];
</script>

{#if browser}
	<LottiePlayer
		src="/assets/box_empty.json"
		autoplay={true}
		loop={true}
		controls={false}
		renderer="svg"
		background="transparent"
		height={150}
		width={150}
		{controlsLayout}
	/>
{/if}
