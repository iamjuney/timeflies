<script lang="ts">
	import DeleteDialog from '$lib/components/delete-dialog.svelte';
	import EmptyBox from '$lib/components/empty-box.svelte';
	import EventDialog from '$lib/components/event-dialog.svelte';
	import PaletteDialog from '$lib/components/palette-dialog.svelte';
	import { TimeFliesEventStore } from '$lib/dexie-db/events.svelte';
	import { longpress } from '$lib/hooks/long-press';
	import { formatEventDate, generateCountdown } from '$lib/utils';
	import { Button } from 'bits-ui';
	import { MagnifyingGlass, Plus, PushPinSimple, PushPinSimpleSlash, X } from 'phosphor-svelte';
	import type { TimeFliesEvent } from '../types';

	let selectedEvents: number[] = $state([]);
	let searchQuery = $state('');
	let allEvents = $derived(TimeFliesEventStore.events);
	let isLoaded = $derived(TimeFliesEventStore.isLoaded);
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
		if (isLoaded && loadMoreTrigger) {
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
		class={[
			'group flex w-full items-center justify-between gap-3 rounded-xl p-4 transition-all duration-200  hover:shadow-md',
			event.color ?? 'bg-muted',
			event.id !== undefined && selectedEvents.includes(event.id) ? 'ring-2 ring-foreground' : ''
		].join(' ')}
		use:longpress={500}
		onlongpress={() => handleEventSelect(event)}
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
	>
		<div class="flex max-w-[60%] flex-col gap-1.5 text-start">
			<h2 class="select-none truncate text-sm font-semibold sm:text-base">
				{event.name}
			</h2>
			<p class="select-none text-nowrap text-xs opacity-80 sm:text-sm">
				{formatEventDate(event.date, event.time)}
			</p>
		</div>
		<span
			class="shrink-0 select-none truncate rounded-full bg-background/20 px-3 py-1.5 text-sm font-bold sm:text-base"
		>
			{generateCountdown(event, now)}
		</span>
	</button>
{/snippet}

<div class="relative flex min-h-screen flex-col items-center px-4 pb-24 pt-6">
	{#if selectedEvents.length > 0}
		<div class="fixed top-0 z-20 h-20 w-full bg-background/80 shadow-sm backdrop-blur-md">
			<div class="mx-auto flex h-full max-w-md items-center justify-center px-4 sm:px-0">
				<div class="flex w-full items-center justify-between">
					<div class="flex items-center gap-4">
						<Button.Root
							class="inline-flex size-10 items-center justify-center rounded-full 
							bg-muted transition-colors hover:bg-muted/80
							active:scale-95 active:transition-all"
							onclick={() => (selectedEvents = [])}
						>
							<X class="size-5" />
						</Button.Root>
						<span class="font-medium">{selectedEvents.length} selected</span>
					</div>
					<div class="flex items-center gap-3">
						{#if selectedEvents.length && selectedEvents.every( (id) => pinnedEvents.find((event) => event.id === id) )}
							<Button.Root
								onclick={() => {
									TimeFliesEventStore.unpinEvents(selectedEvents);
									selectedEvents = [];
								}}
								class="inline-flex size-10 items-center justify-center rounded-full 
								bg-muted transition-colors hover:bg-muted/80
								active:scale-95 active:transition-all"
							>
								<PushPinSimpleSlash class="size-5" />
							</Button.Root>
						{:else}
							<Button.Root
								onclick={() => {
									TimeFliesEventStore.pinEvents(selectedEvents);
									selectedEvents = [];
								}}
								class="inline-flex size-10 items-center justify-center rounded-full 
								bg-muted transition-colors hover:bg-muted/80
								active:scale-95 active:transition-all"
							>
								<PushPinSimple class="size-5" />
							</Button.Root>
						{/if}
						<PaletteDialog bind:selectedEvents />
						<DeleteDialog bind:selectedEvents />
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="w-full max-w-md space-y-6">
		<div class="relative w-full">
			<input
				type="text"
				placeholder="Search events..."
				class="focus:ring-primary/30 h-12 w-full rounded-full bg-muted px-12 text-base font-medium shadow-sm transition-shadow focus:outline-none focus:ring-2"
				bind:value={searchQuery}
			/>
			<MagnifyingGlass class="absolute left-4 top-4 size-5 opacity-70" />
			{#if searchQuery}
				<Button.Root
					onclick={clearSearch}
					class="absolute right-3 top-3 inline-flex size-6 items-center justify-center rounded-full bg-dark/10 
					transition-colors hover:bg-dark/20
					active:scale-95 active:transition-all"
				>
					<X class="size-3.5" />
				</Button.Root>
			{/if}
		</div>

		{#if searchQuery && filteredEvents.length === 0}
			<div class="flex flex-col items-center justify-center gap-3 rounded-xl bg-muted/50 py-12">
				<EmptyBox />
				<p class="text-center text-sm opacity-80">
					No events found matching "<span class="font-medium">{searchQuery}</span>"<br />
					Try a different search term.
				</p>
			</div>
		{:else}
			{#if pinnedEvents.length}
				<div>
					<p class="mb-3 ml-2 text-sm font-medium uppercase tracking-wider opacity-70">Pinned</p>
					<div class="flex flex-col gap-3">
						{#each pinnedEvents as event}
							{@render eventCard(event)}
						{/each}
					</div>
				</div>
			{/if}

			{#if othersEvents.length}
				<div>
					<p class="mb-3 ml-2 text-sm font-medium uppercase tracking-wider opacity-70">Others</p>
					<div class="flex flex-col gap-3">
						{#each displayedOthersEvents as event}
							{@render eventCard(event)}
						{/each}

						<!-- Lazy loading trigger element -->
						{#if displayedOthersEvents.length < othersEvents.length}
							<div bind:this={loadMoreTrigger} class="py-4 text-center">
								<div
									class="border-primary animate-spin mx-auto h-6 w-6 rounded-full border-2 border-t-transparent"
								></div>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		{/if}

		{#if isLoaded && !pinnedEvents.length && !othersEvents.length && !searchQuery}
			<div class="flex flex-col items-center justify-center gap-4 rounded-xl bg-muted/50 py-16">
				<EmptyBox />
				<div class="text-center">
					<p class="text-base opacity-90">No events found</p>
					<p class="mt-1 text-sm opacity-70">
						Add a <span class="font-semibold">new event</span> using the button below!
					</p>
				</div>
			</div>
		{/if}

		<div class="fixed bottom-6 left-1/2 w-full max-w-sm -translate-x-1/2 transform sm:max-w-md">
			<div class="flex flex-col items-end gap-2 px-4 sm:px-0">
				<Button.Root
					onclick={() => (isNewDialogOpen = true)}
					class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg
					transition-colors hover:bg-foreground/90
					active:scale-95 active:transition-all"
				>
					<Plus class="size-7" />
				</Button.Root>
			</div>
		</div>
	</div>
</div>

<EventDialog bind:isDialogOpen={isNewDialogOpen} />
<EventDialog bind:isDialogOpen={isEditDialogOpen} data={selectedEvent} />
