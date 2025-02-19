import { format } from 'date-fns';
import Dexie from 'dexie';
import type { TimeFliesEvent } from '../../types';

export class TimeFliesDatabase extends Dexie {
	events: Dexie.Table<TimeFliesEvent, number>;

	constructor() {
		super('TimeFliesDatabase');
		this.version(1).stores({
			events: '++id,name,date,pinned'
		});
		this.events = this.table('events');
	}
}

export const db = new TimeFliesDatabase();

export const initialData: TimeFliesEvent = {
	name: '',
	date: format(new Date(), 'yyyy-MM-dd'),
	time: null,
	pinned: false
};
