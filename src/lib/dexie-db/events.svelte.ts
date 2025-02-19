import { liveQuery } from 'dexie';
import { toast } from 'svelte-sonner';
import type { TimeFliesEvent } from '../../types';
import { db } from './index';

class TimeFliesEventClass {
	events = $state<TimeFliesEvent[]>([]);

	constructor() {
		this.loadEvents();
	}

	private async loadEvents() {
		liveQuery(() => db.events.orderBy('date').toArray()).subscribe({
			next: (events) => {
				this.events = events;
			},
			error: (error) => {
				console.error('Error in events subscription:', error);
			}
		});
	}

	getPinnedEvents() {
		return this.events.filter((event) => event.pinned);
	}

	getUnpinnedEvents() {
		return this.events.filter((event) => !event.pinned);
	}

	async createEvent(event: Omit<TimeFliesEvent, 'id'>) {
		await db.events.add(event);

		toast.success('Event created successfully');
	}

	private async deleteEvent(id: number) {
		await db.events.delete(id);
	}

	async updateEvent(id: number, updatedEvent: Partial<Omit<TimeFliesEvent, 'id'>>) {
		await db.events.update(id, updatedEvent);
	}

	async pinEvents(eventIds: number[]) {
		for (const id of eventIds) {
			await this.updateEvent(id, { pinned: true });
		}
		toast.success('Events pinned successfully');
	}

	async unpinEvents(eventIds: number[]) {
		for (const id of eventIds) {
			await this.updateEvent(id, { pinned: false });
		}
		toast.success('Events unpinned successfully');
	}

	async deleteEvents(eventIds: number[]) {
		for (const id of eventIds) {
			await this.deleteEvent(id);
		}
		toast.success('Events deleted successfully');
	}
}

export const TimeFliesEventStore = new TimeFliesEventClass();
