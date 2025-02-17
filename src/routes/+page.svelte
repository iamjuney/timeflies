<script lang="ts">
	import { longpress } from '$lib/hooks/long-press';
	import { Button } from 'bits-ui';
	import { format } from 'date-fns';
	import {
		MagnifyingGlass,
		Palette,
		Plus,
		PushPinSimple,
		PushPinSimpleSlash,
		TrashSimple,
		X
	} from 'phosphor-svelte';

	type Event = {
		name: string;
		date: string;
		pinned: boolean;
	};

	let selectedEvents: Event[] = $state([]);
	const events: Event[] = [
		{
			name: 'New Years Day',
			date: '2026-01-01T00:00:00',
			pinned: true
		},
		{
			name: "Valentine's Day",
			date: '2026-02-14T00:00:00',
			pinned: true
		},
		{
			name: 'Independence Day',
			date: '2026-07-04T00:00:00',
			pinned: true
		},
		{
			name: 'Halloween',
			date: '2026-10-31T00:00:00',
			pinned: false
		},
		{
			name: 'Thanksgiving',
			date: '2026-11-26T00:00:00',
			pinned: false
		},
		{
			name: 'Christmas',
			date: '2026-12-25T00:00:00',
			pinned: false
		},
		{
			name: 'Easter',
			date: '2026-04-05T00:00:00',
			pinned: false
		},
		{
			name: 'Labor Day',
			date: '2026-09-07T00:00:00',
			pinned: false
		},
		{
			name: 'Memorial Day',
			date: '2026-05-25T00:00:00',
			pinned: false
		},
		{
			name: "New Year's Eve",
			date: '2026-12-31T00:00:00',
			pinned: false
		}
	];

	let pinnedEvents = events.filter((event) => event.pinned);
	let othersEvents = events.filter((event) => !event.pinned);

	// Add a reactive time state that updates every second
	let now = $state(new Date());

	// Set up the interval when the component mounts
	$effect(() => {
		const interval = setInterval(() => {
			now = new Date();
		}, 1000);

		// Cleanup interval when component unmounts
		return () => clearInterval(interval);
	});

	function generateCountdown(event: Event) {
		const eventDate = new Date(event.date).getTime();
		const currentDate = now.getTime();
		const difference = eventDate - currentDate;

		// Handle case when event has passed
		if (difference < 0) {
			return 'Event has passed';
		}

		const days = Math.floor(difference / (1000 * 60 * 60 * 24));
		const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((difference % (1000 * 60)) / 1000);

		return `${days}d ${hours}h ${minutes}m ${seconds}s`;
	}

	function formatDate(date: string) {
		return format(new Date(date), "MMM dd yyyy 'at' hh:mm a");
	}

	function handleEventSelect(event: Event) {
		if (selectedEvents.some((e) => e.date === event.date && e.name === event.name)) {
			selectedEvents = selectedEvents.filter((e) => e.date !== event.date || e.name !== event.name);
		} else {
			selectedEvents = [...selectedEvents, event];
		}
	}

	let longPressTriggered = false;
</script>

{#snippet eventCard(event: Event)}
	<button
		class="group flex w-full select-none items-center justify-between gap-2 rounded-card bg-muted p-4 ring-stone-600"
		use:longpress={500}
		onlongpress={() => {
			longPressTriggered = true;
			handleEventSelect(event);
		}}
		onclick={(e) => {
			e.preventDefault();
			if (longPressTriggered) {
				longPressTriggered = false;
				return;
			}
			if (selectedEvents.length > 0) handleEventSelect(event);
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleEventSelect(event);
			}
		}}
		class:ring-2={selectedEvents.some((e) => e.date === event.date && e.name === event.name)}
	>
		<div class="flex flex-col gap-1 text-start">
			<h2 class="truncate text-sm font-semibold sm:text-base">{event.name}</h2>
			<p class="text-nowrap text-xs sm:text-sm">{formatDate(event.date)}</p>
		</div>
		<span class="truncate text-base font-semibold sm:text-lg">{generateCountdown(event)}</span>
	</button>
{/snippet}

<div class="relative flex min-h-screen flex-col items-center px-4 py-36 pt-4">
	{#if selectedEvents.length > 0}
		<div class="fixed top-0 z-20 h-16 w-full bg-muted shadow-mini">
			<div class="mx-auto flex max-w-md items-center justify-center px-4 py-4 sm:px-0">
				<div class="flex w-full items-center justify-between">
					<div class="flex items-center gap-4">
						<Button.Root
							class="inline-flex size-8 items-center justify-center rounded-full 
					 active:scale-98 active:transition-all"
							onclick={() => (selectedEvents = [])}
						>
							<X class="size-6" />
						</Button.Root>
						<span>{selectedEvents.length}</span>
					</div>
					<div class="flex items-center gap-4">
						<Button.Root
							class="inline-flex size-8 items-center justify-center rounded-full 
					 active:scale-98 active:transition-all"
						>
							<PushPinSimple class="size-6" />
						</Button.Root>
						<Button.Root
							class="inline-flex size-8 items-center justify-center rounded-full 
					 active:scale-98 active:transition-all"
						>
							<PushPinSimpleSlash class="size-6" />
						</Button.Root>
						<Button.Root
							class="inline-flex size-8 items-center justify-center rounded-full 
					 active:scale-98 active:transition-all"
						>
							<Palette class="size-6" />
						</Button.Root>
						<Button.Root
							class="inline-flex size-8 items-center justify-center rounded-full 
					 active:scale-98 active:transition-all"
						>
							<TrashSimple class="size-6" />
						</Button.Root>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="w-full max-w-md space-y-4">
		<!-- <img src="/logo-simple.png" alt="TimeFlies Logo" class="mx-auto h-10 w-auto sm:h-16" /> -->

		<div class="relative w-full">
			<input
				type="text"
				placeholder="Search"
				class="h-10 w-full rounded-full bg-muted px-9 text-sm font-medium sm:h-12 sm:px-12 sm:text-base"
			/>
			<MagnifyingGlass class="absolute left-3 top-3 size-4 sm:left-4 sm:top-3 sm:size-6" />
		</div>

		<p class="text-xs sm:text-sm">Pinned</p>

		<div class="flex flex-col gap-2">
			{#each pinnedEvents as event}
				{@render eventCard(event)}
			{/each}
		</div>

		<p class="text-xs sm:text-sm">Others</p>

		<div class="flex flex-col gap-2">
			{#each othersEvents as event}
				{@render eventCard(event)}
			{/each}
		</div>

		<div class="fixed bottom-4 left-1/2 w-full max-w-sm -translate-x-1/2 transform sm:max-w-md">
			<div class="flex flex-col items-end gap-2 px-4 sm:px-0">
				<Button.Root
					class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-dark text-background shadow-mini
				hover:bg-dark/95 active:scale-98 active:transition-all"
				>
					<Plus class="size-6" />
				</Button.Root>

				<!-- ads placeholder -->
				<div class="w-full rounded-lg border bg-muted p-4 shadow-xl">
					<p class="text-center text-sm">Your ad here</p>
				</div>
			</div>
		</div>
	</div>
</div>
