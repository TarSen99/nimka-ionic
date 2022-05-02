import firebase from 'firebase/app';

export const initFirebase = () => {
	const app = firebase.initializeApp({
		apiKey: process.env.VUE_APP_FIREBASE_API_KEY, // Auth / General Use
		authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN, // Auth with popup/redirect
		//   databaseURL: , // Realtime Database
		storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET, // Storage
		messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID, // Cloud Messaging
		projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
		appId: process.env.VUE_APP_FIREBASE_APP_ID,
		databaseURL: process.env.VUE_APP_FIREBASE_DB,
	});

	return app;
};
