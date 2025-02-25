import { formatInTimeZone } from 'date-fns-tz';
import type { TimeFliesEvent } from '../types';

export function generateCountdown(event: TimeFliesEvent, now: Date) {
	const baseDate = new Date(event.date);

	if (event.time && typeof event.time === 'string') {
		const [hours, minutes] = event.time.split(':').map(Number);
		if (!isNaN(hours) && !isNaN(minutes)) {
			baseDate.setHours(hours, minutes, 0, 0);
		}
	}

	const currentDate = now.getTime();
	const difference = baseDate.getTime() - currentDate;

	if (difference < 0) {
		return 'Event has passed';
	}

	const days = Math.floor(difference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((difference % (1000 * 60)) / 1000);

	return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function formatEventDate(date: string, time: string | null) {
	if (time) {
		return formatInTimeZone(new Date(`${date}T${time}`), 'Asia/Manila', "MMM dd yyyy 'at' h:mm a");
	}
	return formatInTimeZone(new Date(date), 'Asia/Manila', 'MMM dd yyyy');
}
