<script lang="ts">
	import { TimeFliesEventStore } from '$lib/dexie-db/events.svelte';
	import { Button, Dialog } from 'bits-ui';
	import { Palette } from 'phosphor-svelte';

	let {
		selectedEvents = $bindable()
	}: {
		selectedEvents: number[];
	} = $props();
	let isDialogOpen = $state(false);
	const colors = [
		'bg-note-card-1',
		'bg-note-card-2',
		'bg-note-card-3',
		'bg-note-card-4',
		'bg-note-card-5',
		'bg-note-card-6',
		'bg-note-card-7',
		'bg-note-card-8',
		'bg-note-card-9',
		'bg-note-card-10',
		'bg-note-card-11'
	];
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger
		class="inline-flex size-8 items-center justify-center rounded-full 
					 active:scale-98 active:transition-all"
	>
		<Palette class="size-6" />
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[80%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background-alt p-7 shadow-popover outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-sm md:w-full "
		>
			<div class="flex flex-col gap-4 pb-6">
				<Dialog.Title class="text-lg font-semibold tracking-tight">Event Color</Dialog.Title>
			</div>
			<div class="grid grid-cols-4 place-items-center gap-4">
				<Button.Root
					class="size-12 rounded-full bg-muted shadow-mini transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 active:scale-95 sm:size-16"
					onclick={() => {
						TimeFliesEventStore.clearEventColor(selectedEvents);
						isDialogOpen = false;
					}}
				/>
				{#each Array(11) as _, i}
					<Button.Root
						class={[
							'size-12 rounded-full shadow-mini transition-all sm:size-16',
							'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2',
							'focus-visible:ring-dark focus-visible:ring-offset-2 active:scale-95',
							colors[i]
						].join(' ')}
						onclick={() => {
							TimeFliesEventStore.recolorEvents(selectedEvents, colors[i]);
							isDialogOpen = false;
						}}
					/>
				{/each}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
