<script lang="ts">
	import { TimeFliesEventStore } from '$lib/dexie-db/events.svelte';
	import { AlertDialog, Button } from 'bits-ui';
	import { TrashSimple } from 'phosphor-svelte';

	let { selectedEvents = $bindable() } = $props();
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger
		class="inline-flex size-8 items-center justify-center rounded-full 
					 active:scale-98 active:transition-all"
	>
		<TrashSimple class="size-6" />
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<AlertDialog.Content
			class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-card-lg border bg-background p-7 shadow-popover outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-lg md:w-full "
		>
			<div class="flex flex-col gap-4 pb-6">
				<AlertDialog.Title class="text-lg font-semibold tracking-tight">
					Confirm Deletion
				</AlertDialog.Title>
				<AlertDialog.Description class="text-sm text-foreground-alt">
					{#if selectedEvents.length > 1}
						This action cannot be undone. Are you sure you want to delete these events?
					{:else}
						This action cannot be undone. Are you sure you want to delete this event?
					{/if}
				</AlertDialog.Description>
			</div>
			<div class="flex w-full items-center justify-center gap-2">
				<AlertDialog.Cancel
					class="inline-flex h-input w-full items-center justify-center rounded-input bg-muted text-[15px] font-medium shadow-mini transition-all hover:bg-dark-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
				>
					Cancel
				</AlertDialog.Cancel>
				<Button.Root
					onclick={() => {
						TimeFliesEventStore.deleteEvents(selectedEvents);
						selectedEvents = [];
					}}
					class="inline-flex h-input w-full items-center justify-center rounded-input bg-dark text-[15px] font-semibold text-background shadow-mini transition-all hover:bg-dark/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
				>
					Continue
				</Button.Root>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
