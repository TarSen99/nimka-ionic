import firebase from 'firebase/app';
import 'firebase/database';
import { DateTime } from 'luxon';

const USERS_PATH = 'users';

const SUBSTRUCT_SECS = 3;

const memory = {};

const checkIfMessageNew = (date) => {
	if (!date) {
		return false;
	}

	let createdAt = new Date(date);
	const luxonDate = DateTime.fromJSDate(createdAt);
	const now = DateTime.fromJSDate(new Date());

	const diff = now.diff(luxonDate, 'seconds').toObject({});

	return diff.seconds < SUBSTRUCT_SECS;
};

const DEFAULT_REF = `${USERS_PATH}/_{userId}`;

class RealTime {
	constructor() {
		this.db = null;
		this.refs = {};
		this.userId = null;
		this.ready = [];
	}

	onready(cb) {
		if (this.db) {
			this.ready.push(cb);

			this.runReady();
			return;
		}

		this.ready.push(cb);
	}

	runReady() {
		this.ready.forEach((cb) => cb());
		this.ready = [];
	}

	connect(userId) {
		if (window._db) {
			return;
		}

		this.refs = {};
		this.userId = userId;
		this.db = firebase.database();
		this.db.goOnline();
		window._db = this.db;

		this.runReady();
	}

	handleMessage(data = {}) {
		if (typeof data !== 'object' || !data) {
			return;
		}

		const channel = data._channel;

		Object.keys(data).forEach((key) => {
			for (let id in data[key]) {
				const currItem = data[key][id];
				const isNew = checkIfMessageNew(currItem.createdAt);

				if (!isNew) {
					continue;
				}

				if (memory[currItem.createdAt]) {
					continue;
				}

				memory[currItem.createdAt] = true;

				const valueId = id.slice(0);
				const listeners = this.refs[channel].listeners[key] || [];

				listeners.forEach((l) => l({ ...currItem, valueId, key }));
			}
		});
	}

	disconnect() {
		if (!this.db) {
			return;
		}

		this.db.goOffline();

		Object.keys(this.refs).forEach((refKey) => {
			const currRef = this.refs[refKey].ref;
			currRef.ref.off('value');
			this.refs[refKey].listeners = {};
		});

		// this.refs = {};

		this.db = null;
		window._db = null;
		this.ready = [];
	}

	subscribe(key, callback, refPath) {
		const currPath = refPath || DEFAULT_REF.replace('{userId}', this.userId);
		const ref = this.db.ref(currPath);

		if (!this.refs[currPath]) {
			this.refs[currPath] = {
				ref: ref,
				listeners: {},
			};
		}

		ref.on('value', (snapshot) => {
			const data = snapshot.val();
			this.handleMessage({ ...data, _channel: currPath });
		});

		if (!this.refs[currPath].listeners[key]) {
			this.refs[currPath].listeners[key] = [];
		}

		this.refs[currPath].listeners[key].push(callback);
	}

	unsubscribe(key, callback, refPath) {
		const currPath = refPath || DEFAULT_REF.replace('{userId}', this.userId);
		const row = this.refs[currPath]?.listeners[key] || [];

		const listenerIndex = row.findIndex((cb) => cb === callback);

		if (listenerIndex < 0) {
			return;
		}

		row.splice(listenerIndex, 1);
	}
}

const realtime = new RealTime();

export default realtime;
