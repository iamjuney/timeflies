<script lang="ts">
	import DeleteDialog from '$lib/components/delete-dialog.svelte';
	import NewDialog from '$lib/components/new-dialog.svelte';
	import { TimeFliesEventStore } from '$lib/dexie-db/events.svelte';
	import { longpress } from '$lib/hooks/long-press';
	import { Button } from 'bits-ui';
	import { format } from 'date-fns';
	import { MagnifyingGlass, Palette, PushPinSimple, PushPinSimpleSlash, X } from 'phosphor-svelte';
	import type { TimeFliesEvent } from '../types';

	let selectedEvents: number[] = $state([]);
	let pinnedEvents = $derived(TimeFliesEventStore.getPinnedEvents());
	let othersEvents = $derived(TimeFliesEventStore.getUnpinnedEvents());

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

	function generateCountdown(event: TimeFliesEvent) {
		const eventDate = event.time ? new Date(event.time) : new Date(event.date);
		const currentDate = now.getTime();
		const difference = eventDate.getTime() - currentDate;

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

	function handleEventSelect(event: TimeFliesEvent) {
		if (!event.id) return;

		if (selectedEvents.includes(event.id)) {
			selectedEvents.splice(selectedEvents.indexOf(event.id), 1);
		} else {
			selectedEvents.push(event.id);
		}
	}

	let longPressTriggered = false;
</script>

{#snippet eventCard(event: TimeFliesEvent)}
	<button
		class="group flex w-full select-none items-center justify-between gap-2 rounded-card bg-muted p-4 ring-foreground"
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
		class:ring-2={event.id !== undefined && selectedEvents.includes(event.id)}
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
				<NewDialog />

				<!-- ads placeholder -->
				<div class="w-full rounded-lg border bg-muted p-4 shadow-xl">
					<p class="text-center text-sm">Your ad here</p>
				</div>
			</div>
		</div>
	</div>
</div>
