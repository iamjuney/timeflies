<script lang="ts">
	import Checkbox from '$lib/components/checkbox.svelte';
	import { Button } from 'bits-ui';
	import { fade } from 'svelte/transition';

	let showAgain = $state(false);
</script>

<div
	class="relative flex min-h-screen flex-col items-center px-4 py-20"
	out:fade={{ duration: 300 }}
>
	<div class="w-full max-w-md space-y-32 text-center">
		<div class="-space-y-4">
			<img src="/logo.png" alt="TimeFlies Logo" class="mx-auto h-28 w-28 sm:h-36 sm:w-36" />

			<h1 class="text-2xl sm:text-4xl">
				<span class="font-bold">Time</span><span class="italic">Flies</span>
			</h1>
		</div>

		<div class="space-y-2">
			<h2 class="text-xl font-bold tracking-tight sm:text-3xl">Simple. Elegant. Effective.</h2>
			<p class="mx-auto max-w-sm text-base leading-relaxed sm:text-lg">
				<span class="font-normal">Time</span><span class="italic">Flies</span>
				makes event tracking easy. Add events, watch the time tick by, and never miss a beat.
			</p>
		</div>

		<div class="fixed bottom-8 left-0 right-0 space-y-4 px-4">
			<Button.Root
				class="inline-flex h-12 w-full max-w-sm items-center justify-center rounded-input bg-dark
	px-[21px] text-[15px] font-semibold text-background shadow-mini
	hover:bg-dark/95 active:scale-98 active:transition-all"
			>
				Continue
			</Button.Root>
			<Checkbox />
		</div>
	</div>
</div>
