<script lang="ts">
	import DeleteDialog from '$lib/components/delete-dialog.svelte';
	import EmptyBox from '$lib/components/empty-box.svelte';
	import EventDialog from '$lib/components/event-dialog.svelte';
	import { TimeFliesEventStore } from '$lib/dexie-db/events.svelte';
	import { longpress } from '$lib/hooks/long-press';
	import { Button } from 'bits-ui';
	import { format } from 'date-fns';
	import {
		MagnifyingGlass,
		Palette,
		Plus,
		PushPinSimple,
		PushPinSimpleSlash,
		X
	} from 'phosphor-svelte';
	import { IsMounted } from 'runed';
	import type { TimeFliesEvent } from '../types';

	let selectedEvents: number[] = $state([]);
	let searchQuery = $state('');
	const isMounted = new IsMounted();
	let allEvents = $derived(TimeFliesEventStore.events);
	let isNewDialogOpen = $state(false);
	let isEditDialogOpen = $state(false);
	let selectedEvent = $state<TimeFliesEvent>();

	// Lazy loading variables
	let itemsPerPage = $state(10);
	let currentPage = $state(1);
	let loadMoreObserver: IntersectionObserver;
	let loadMoreTrigger: HTMLElement | null = $state(null);

	// Filtered events based on search
	let filteredEvents = $derived(
		allEvents.filter((event) => {
			const query = searchQuery.toLowerCase().trim();
			return event.name.toLowerCase().includes(query);
		})
	);

	// Separate filtered events into pinned and unpinned
	let pinnedEvents = $derived(filteredEvents.filter((event) => event.pinned));
	let othersEvents = $derived(filteredEvents.filter((event) => !event.pinned));

	// Lazy loaded events
	let displayedOthersEvents = $derived(othersEvents.slice(0, currentPage * itemsPerPage));

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

	// Initialize intersection observer for infinite scroll
	$effect(() => {
		if (isMounted.current && loadMoreTrigger) {
			loadMoreObserver = new IntersectionObserver(handleIntersection, {
				root: null,
				rootMargin: '100px',
				threshold: 0.1
			});
			loadMoreObserver.observe(loadMoreTrigger);

			return () => {
				if (loadMoreObserver) {
					loadMoreObserver.disconnect();
				}
			};
		}
	});

	function handleIntersection(entries: IntersectionObserverEntry[]) {
		const [entry] = entries;
		if (entry.isIntersecting && displayedOthersEvents.length < othersEvents.length) {
			currentPage++;
		}
	}

	function clearSearch() {
		searchQuery = '';
		currentPage = 1; // Reset pagination when search changes
	}

	function generateCountdown(event: TimeFliesEvent) {
		// Create a base date from the event.date
		const baseDate = new Date(event.date);

		// If time is provided as a string (e.g. "14:30"), parse and set it on the base date
		if (event.time && typeof event.time === 'string') {
			const [hours, minutes] = event.time.split(':').map(Number);
			if (!isNaN(hours) && !isNaN(minutes)) {
				baseDate.setHours(hours, minutes, 0, 0);
			}
		}

		const currentDate = now.getTime();
		const difference = baseDate.getTime() - currentDate;

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

	function formatDate(date: string, time: string | null) {
		const formattedDate = format(new Date(date), 'MMM dd yyyy');
		if (time) {
			return `${formattedDate} at ${format(new Date(`2000-01-01T${time}`), 'h:mm a')}`;
		}
		return formattedDate;
	}

	function handleEventSelect(event: TimeFliesEvent) {
		if (!event.id) return;

		const eventIndex = selectedEvents.indexOf(event.id);
		if (eventIndex !== -1) {
			selectedEvents.splice(eventIndex, 1);
		} else {
			selectedEvents.push(event.id);
		}
	}
</script>

{#snippet eventCard(event: TimeFliesEvent)}
	<button
		class="group flex w-full select-none items-center justify-between gap-2 rounded-card bg-muted p-4 ring-foreground"
		use:longpress={500}
		onlongpress={() => {
			handleEventSelect(event);
		}}
		onclick={(e) => {
			if (selectedEvents.length > 0) {
				handleEventSelect(event);
			} else {
				selectedEvent = event;
				isEditDialogOpen = true;
			}
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleEventSelect(event);
			}
		}}
		class:ring-2={event.id !== undefined && selectedEvents.includes(event.id)}
	>
		<div class="flex flex-col gap-1 text-start">
			<h2 class="truncate text-sm font-semibold sm:text-base">{event.name}</h2>
			<p class="text-nowrap text-xs sm:text-sm">{formatDate(event.date, event.time)}</p>
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
						{#if selectedEvents.length && selectedEvents.every( (id) => pinnedEvents.find((event) => event.id === id) )}
							<Button.Root
								onclick={() => {
									TimeFliesEventStore.unpinEvents(selectedEvents);
									selectedEvents = [];
								}}
								class="inline-flex size-8 items-center justify-center rounded-full active:scale-98 active:transition-all"
							>
								<PushPinSimpleSlash class="size-6" />
							</Button.Root>
						{:else}
							<Button.Root
								onclick={() => {
									TimeFliesEventStore.pinEvents(selectedEvents);
									selectedEvents = [];
								}}
								class="inline-flex size-8 items-center justify-center rounded-full active:scale-98 active:transition-all"
							>
								<PushPinSimple class="size-6" />
							</Button.Root>
						{/if}
						<Button.Root
							class="inline-flex size-8 items-center justify-center rounded-full 
					 active:scale-98 active:transition-all"
						>
							<Palette class="size-6" />
						</Button.Root>
						<DeleteDialog bind:selectedEvents />
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
				bind:value={searchQuery}
			/>
			<MagnifyingGlass class="absolute left-3 top-3 size-4 sm:left-4 sm:top-3 sm:size-6" />
			{#if searchQuery}
				<Button.Root
					onclick={clearSearch}
					class="absolute right-3 top-3 inline-flex size-4 items-center justify-center rounded-full active:scale-98 active:transition-all sm:right-4 sm:size-6"
				>
					<X class="size-3 sm:size-4" />
				</Button.Root>
			{/if}
		</div>

		{#if searchQuery && filteredEvents.length === 0}
			<div class="flex flex-col items-center justify-center gap-2 py-4">
				<EmptyBox />
				<p class="text-center text-xs sm:text-sm">
					No events found matching "{searchQuery}". <br /> Try a different search term.
				</p>
			</div>
		{:else}
			{#if pinnedEvents.length}
				<p class="text-xs sm:text-sm">Pinned</p>
				<div class="flex flex-col gap-2">
					{#each pinnedEvents as event}
						{@render eventCard(event)}
					{/each}
				</div>
			{/if}

			{#if othersEvents.length}
				<p class="text-xs sm:text-sm">Others</p>
				<div class="flex flex-col gap-2">
					{#each displayedOthersEvents as event}
						{@render eventCard(event)}
					{/each}

					<!-- Lazy loading trigger element -->
					{#if displayedOthersEvents.length < othersEvents.length}
						<div bind:this={loadMoreTrigger} class="py-2 text-center">
							<div
								class="animate-spin border-primary mx-auto h-6 w-6 rounded-full border-2 border-t-transparent"
							></div>
						</div>
					{/if}
				</div>
			{/if}
		{/if}

		{#if isMounted.current && !pinnedEvents.length && !othersEvents.length && !searchQuery}
			<div class="flex flex-col items-center justify-center gap-2 py-4">
				<EmptyBox />
				<p class="text-center text-xs sm:text-sm">
					No events found. <br /> Add a <span class="font-semibold">new event</span> using the button
					below!
				</p>
			</div>
		{/if}

		<div class="fixed bottom-4 left-1/2 w-full max-w-sm -translate-x-1/2 transform sm:max-w-md">
			<div class="flex flex-col items-end gap-2 px-4 sm:px-0">
				<Button.Root
					onclick={() => (isNewDialogOpen = true)}
					class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-dark text-background shadow-xl
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

<EventDialog bind:isDialogOpen={isNewDialogOpen} />
<EventDialog bind:isDialogOpen={isEditDialogOpen} data={selectedEvent} />
