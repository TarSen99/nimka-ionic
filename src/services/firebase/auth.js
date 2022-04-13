import firebase from 'firebase/app';
import 'firebase/auth';

export const authUserWithEmail = ({ email, password }) => {
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

	return firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			return userCredential.user;
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;

			return {
				errorCode,
				errorMessage,
			};
		});
};

export const signOut = async () => {
	const auth = firebase.auth();

	return auth.signOut();
};

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
