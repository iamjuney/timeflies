<script lang="ts">
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		detectSWUpdate();
	});

	async function detectSWUpdate() {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			if (newSW) {
				newSW.addEventListener('statechange', () => {
					if (newSW.state === 'installed') {
						if (confirm('New update available! Reload to update?')) {
							newSW.postMessage({ type: 'SKIP_WAITING' });
							window.location.reload();
						}
					}
				});
			}
		});
	}
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>TimeFlies</title>
	<meta
		name="description"
		content="TimeFlies makes event tracking easy. Add events, watch the time tick by, and never miss a beat."
	/>
	<meta
		name="keywords"
		content="event tracking, time tracking, productivity, management, time management"
	/>
	<meta name="author" content="Aljon Lerios" />
	<meta name="author" content="Aljon Lerios" />
	<meta name="publisher" content="Aljon Lerios" />
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<meta name="application-name" content="TimeFlies" />
	<meta name="version" content="1.0.0" />
	<meta name="security-level" content="high" />
	<!-- Custom tag for internal reference -->
</svelte:head>

<Toaster position="bottom-center" />
{@render children()}
