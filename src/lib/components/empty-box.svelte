<script>
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { IsMounted } from 'runed';

	const isMounted = new IsMounted();
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

{#if isMounted.current}
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
