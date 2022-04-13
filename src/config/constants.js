export const CURRENT_COMPANY_KEY = 'company_id';
export const CURRENT_USER_KEY = 'user_id';
export const CURRENT_USER_ROLE = 'role';
export const CURRENT_TOKEN = 'fb_token';
export const CURRENT_GEOLOCATION = 'geolocation';

export const ORDER_STATUSES_LIST = [
	{
		value: 'active',
		type: 'warning',
	},
	{
		value: 'payed',
		type: 'success',
	},
	{
		value: 'cancelled',
		type: 'danger',
	},
	{
		value: 'completed',
		type: 'success',
	},
];

export const FIREBASE_ERROR_CODES = {
	'auth/invalid-user-token': 'Session has expired',
	'auth/user-token-expired': 'Session has expired',
	'auth/email-already-in-use': 'Such user already exists',
	'auth/credential-already-in-use': 'Such user already exists',
	'auth/account-exists-with-different-credential': 'Such user already exists',
	'auth/invalid-email': 'Email is not valid',
	'auth/weak-password': 'Password is too weak',
	'auth/user-not-found': 'Credentials are not valid',
	'auth/wrong-password': 'Credentials are not valid',
};

export const ROLES = {
	ADMIN: 'admin',
	GUEST: 'guest',
	EMPLOYEE: 'employee',
	MANAGER: 'manager',
	OWNER: 'owner',
	CUSTOMER: 'customer',
};

export const ORDER_STATUSES = {
	ACTIVE: 'active',
	PAYED: 'payed',
	COMPLETED: 'completed',
	CANCELLED: 'cancelled',
};
