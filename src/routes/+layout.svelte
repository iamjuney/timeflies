<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
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
	<!-- HTML Meta Tags -->
	<meta charset="utf-8" />
	<title>TimeFlies | Event Tracking App by Aljon Lerios</title>
	<link rel="icon" href="/favicon.ico" type="image/x-icon" />
	<link rel="icon" href="/pwa-64x64.png" type="image/png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta
		name="description"
		content="TimeFlies makes event tracking easy. Add events, watch the time tick by, and never miss a beat. A productivity app by Aljon Lerios."
	/>
	<link rel="canonical" href="https://timeflies.aljonlerios.com/" />
	<meta
		name="keywords"
		content="TimeFlies, event tracking, time tracking, productivity, management, time management, Aljon Lerios, web app, PWA"
	/>
	<meta name="author" content="Aljon Lerios" />
	<meta name="publisher" content="Aljon Lerios" />
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<meta name="application-name" content="TimeFlies" />
	<meta name="revisit-after" content="7 days" />
	<meta name="rating" content="general" />
	<meta name="distribution" content="global" />
	<meta name="language" content="en" />
	<meta name="coverage" content="Worldwide" />
	<meta name="category" content="Productivity" />
	<meta http-equiv="content-security-policy" content="upgrade-insecure-requests" />
	<meta http-equiv="x-ua-compatible" content="IE=edge" />

	<!-- Hreflang Tags -->
	<link rel="alternate" hreflang="en" href="https://timeflies.aljonlerios.com/" />

	<!-- Open Graph / Facebook Meta Tags -->
	<meta property="og:url" content="https://timeflies.aljonlerios.com/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="TimeFlies | Event Tracking App by Aljon Lerios" />
	<meta
		property="og:description"
		content="TimeFlies makes event tracking easy. Add events, watch the time tick by, and never miss a beat. A productivity app by Aljon Lerios."
	/>
	<meta property="og:image" content="https://timeflies.aljonlerios.com/logo.png" />
	<meta property="og:site_name" content="TimeFlies" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="timeflies.aljonlerios.com" />
	<meta property="twitter:url" content="https://timeflies.aljonlerios.com/" />
	<meta name="twitter:title" content="TimeFlies | Event Tracking App by Aljon Lerios" />
	<meta
		name="twitter:description"
		content="TimeFlies makes event tracking easy. Add events, watch the time tick by, and never miss a beat. A productivity app by Aljon Lerios."
	/>
	<meta name="twitter:image" content="https://timeflies.aljonlerios.com/logo.png" />
	<meta name="twitter:creator" content="@iamjuney_1412" />

	<!-- PWA Meta Tags -->
	<meta name="theme-color" content="#000000" />
	<link rel="manifest" href="/manifest.json" />

	<!-- Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "TimeFlies",
			"url": "https://timeflies.aljonlerios.com/",
			"description": "TimeFlies makes event tracking easy. Add events, watch the time tick by, and never miss a beat.",
			"applicationCategory": "Productivity",
			"operatingSystem": "Web Browser",
			"author": {
				"@type": "Person",
				"name": "Aljon Lerios",
				"url": "https://www.aljonlerios.com/",
				"sameAs": [
					"https://www.linkedin.com/in/aljon-lerios/",
					"https://github.com/iamjuney",
					"https://x.com/iamjuney_1412"
				]
			},
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			}
		}
	</script>
</svelte:head>

<ModeWatcher />
<Toaster position="bottom-center" />
{@render children()}
