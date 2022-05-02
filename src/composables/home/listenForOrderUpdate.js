import realtime from '@/services/firebase/db.js';
import { REALTIME_CHANNELS } from '@/config/constants.js';

export default function (cb) {
	const handleOrderUpdate = (data) => {
		cb(data);
	};

	realtime.subscribe(REALTIME_CHANNELS.ORDERS, handleOrderUpdate);
}
