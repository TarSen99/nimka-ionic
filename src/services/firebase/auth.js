import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	initializeAuth,
} from 'firebase/auth';

import { app } from '@/services/firebase/init.js';

// const auth = initializeAuth(app);

// export const authUser = ({ email, password }) => {
// 	return createUserWithEmailAndPassword(auth, email, password)
// 		.then((userCredential) => {
// 			// Signed in
// 			return userCredential.user;
// 		})
// 		.catch((error) => {
// 			const errorCode = error.code;
// 			const errorMessage = error.message;

// 			return {
// 				errorCode,
// 				errorMessage,
// 			};
// 		});
// };

// export const subscribeForAuthStateChange = function() {
// 	return new Promise((resolve) => {
// 		onAuthStateChanged(auth, (user) => {
// 			if (user) {
// 				// User is signed in, see docs for a list of available properties
// 				// https://firebase.google.com/docs/reference/js/firebase.User
// 				// const uid = user.uid;
// 				resolve(user);
// 				return;
// 			}

// 			resolve(null);
// 		});
// 	});
// };
