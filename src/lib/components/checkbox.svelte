<script lang="ts">
	import { Checkbox, Label } from 'bits-ui';
	import { Check, Minus } from 'phosphor-svelte';
</script>

<div class="flex items-center justify-center space-x-3">
	<Checkbox.Root
		id="terms"
		aria-labelledby="terms-label"
		class="peer inline-flex size-[20px] items-center justify-center rounded-md border border-muted bg-foreground transition-all duration-150 ease-in-out active:scale-98 data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40"
		name="hello"
		indeterminate
	>
		{#snippet children({ checked, indeterminate })}
			<div class="inline-flex items-center justify-center text-background">
				{#if indeterminate}
					<Minus class="size-[12px]" weight="bold" />
				{:else if checked}
					<Check class="size-[12px]" weight="bold" />
				{/if}
			</div>
		{/snippet}
	</Checkbox.Root>
	<Label.Root
		id="terms-label"
		for="terms"
		class="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm"
	>
		Don't show this again
	</Label.Root>
</div>
