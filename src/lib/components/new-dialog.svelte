<script lang="ts">
	import { initialData } from '$lib/dexie-db';
	import { TimeFliesEventStore } from '$lib/dexie-db/events.svelte';
	import { parseDate } from '@internationalized/date';
	import { Button, DatePicker, Dialog, Label, Separator } from 'bits-ui';
	import { Plus, X } from 'phosphor-svelte';
	import CalendarBlank from 'phosphor-svelte/lib/CalendarBlank';
	import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
	import CaretRight from 'phosphor-svelte/lib/CaretRight';
	import type { TimeFliesEvent } from '../../types';

	let event = $state<TimeFliesEvent>(initialData);
	let newDate = $state(parseDate(event.date));
	let isDialogOpen = $state(false);

	$effect(() => {
		event.date = newDate.toString();
	});
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger
		class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-dark text-background shadow-mini
				hover:bg-dark/95 active:scale-98 active:transition-all"
	>
		<Plus class="size-6" />
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				Create New TimeFlies Event
			</Dialog.Title>
			<Separator.Root class="-mx-5 mb-6 mt-5 block h-px bg-muted" />
			<Dialog.Description class="text-sm text-foreground-alt">
				Fill in the details for your event.
			</Dialog.Description>
			<div class="flex flex-col gap-4 py-7">
				<div>
					<Label.Root for="eventName" class="text-sm font-medium">Event Name</Label.Root>
					<input
						bind:value={event.name}
						name="name"
						type="text"
						class="mt-1 inline-flex h-input w-full rounded-card-sm border border-border-input bg-background px-4 text-base placeholder:text-foreground-alt/50 hover:border-dark-40 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background sm:text-sm"
						placeholder="Enter event name"
					/>
				</div>
				<div>
					<DatePicker.Root
						weekdayFormat="short"
						fixedWeeks={true}
						bind:value={newDate}
						hideTimeZone={false}
					>
						<div class="flex w-full flex-col gap-1.5">
							<DatePicker.Label class="block select-none text-sm font-medium">Date</DatePicker.Label
							>
							<DatePicker.Input
								class="flex h-input w-full select-none items-center rounded-input border border-border-input bg-background px-2 py-3 text-sm tracking-[0.01em] text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
							>
								{#snippet children({ segments })}
									{#each segments as { part, value }}
										<div class="inline-block select-none">
											{#if part === 'literal'}
												<DatePicker.Segment {part} class="p-1 text-muted-foreground"
													>{value}</DatePicker.Segment
												>
											{:else}
												<DatePicker.Segment
													{part}
													class="rounded px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground"
													>{value}</DatePicker.Segment
												>
											{/if}
										</div>
									{/each}
									<DatePicker.Trigger
										class="ml-auto inline-flex size-8 items-center justify-center rounded text-foreground/60 transition-all hover:bg-muted active:bg-dark-10"
									>
										<CalendarBlank class="size-6" />
									</DatePicker.Trigger>
								{/snippet}
							</DatePicker.Input>
							<DatePicker.Content sideOffset={6} class="z-50">
								<DatePicker.Calendar
									class="rounded-card-lg border border-dark-10 bg-background-alt p-5 shadow-popover"
								>
									{#snippet children({ months, weekdays })}
										<DatePicker.Header class="flex items-center justify-between">
											<DatePicker.PrevButton
												class="inline-flex size-10 items-center justify-center rounded bg-background-alt transition-all hover:bg-muted active:scale-98"
											>
												<CaretLeft class="size-6" />
											</DatePicker.PrevButton>
											<DatePicker.Heading class="text-[15px] font-medium" />
											<DatePicker.NextButton
												class="inline-flex size-10 items-center justify-center rounded bg-background-alt transition-all hover:bg-muted active:scale-98"
											>
												<CaretRight class="size-6" />
											</DatePicker.NextButton>
										</DatePicker.Header>
										<div class="flex flex-col space-y-4 pt-4">
											{#each months as month}
												<DatePicker.Grid class="w-full border-collapse select-none space-y-1">
													<DatePicker.GridHead>
														<DatePicker.GridRow class="mb-1 flex w-full justify-between">
															{#each weekdays as day}
																<DatePicker.HeadCell
																	class="w-10 rounded-md text-xs font-normal text-muted-foreground"
																>
																	<div>{day.slice(0, 2)}</div>
																</DatePicker.HeadCell>
															{/each}
														</DatePicker.GridRow>
													</DatePicker.GridHead>
													<DatePicker.GridBody>
														{#each month.weeks as weekDates}
															<DatePicker.GridRow class="flex w-full">
																{#each weekDates as date}
																	<DatePicker.Cell
																		{date}
																		month={month.value}
																		class="relative size-10 p-0 text-center text-sm"
																	>
																		<DatePicker.Day
																			class="group relative inline-flex size-10 items-center justify-center whitespace-nowrap rounded border border-transparent bg-transparent p-0 text-sm font-normal text-foreground transition-all hover:border-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[selected]:bg-foreground data-[selected]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-background data-[unavailable]:text-muted-foreground data-[unavailable]:line-through"
																		>
																			<div
																				class="absolute top-[5px] hidden size-1 rounded-full bg-foreground transition-all group-data-[today]:block group-data-[selected]:bg-background"
																			></div>
																			{date.day}
																		</DatePicker.Day>
																	</DatePicker.Cell>
																{/each}
															</DatePicker.GridRow>
														{/each}
													</DatePicker.GridBody>
												</DatePicker.Grid>
											{/each}
										</div>
									{/snippet}
								</DatePicker.Calendar>
							</DatePicker.Content>
						</div>
					</DatePicker.Root>
				</div>
				<div>
					<Label.Root for="eventTime" class="text-sm font-medium">Time (optional)</Label.Root>
					<input
						bind:value={event.time}
						name="time"
						type="time"
						class="mt-1 inline-flex h-input w-full rounded-card-sm border border-border-input bg-background px-4 text-base placeholder:text-foreground-alt/50 hover:border-dark-40 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background sm:text-sm"
					/>
				</div>
				<div class="flex items-center gap-2">
					<label for="eventPinned" class="text-sm font-medium">Pinned</label>
					<input
						bind:checked={event.pinned}
						name="pinned"
						type="checkbox"
						class="h-4 w-4 rounded border border-border-input bg-background text-dark focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
					/>
				</div>
			</div>
			<div class="flex w-full justify-end">
				<Button.Root
					onclick={() => {
						TimeFliesEventStore.createEvent($state.snapshot(event));
						isDialogOpen = false;
					}}
					class="inline-flex h-input w-full items-center justify-center rounded-input bg-dark px-[50px] text-[15px] font-semibold text-background shadow-mini hover:bg-dark/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
				>
					Save
				</Button.Root>
			</div>
			<Dialog.Close
				class="absolute right-5 top-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
			>
				<div>
					<X class="size-5 text-foreground" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
