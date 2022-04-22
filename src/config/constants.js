export const CURRENT_COMPANY_KEY = 'company_id';
export const CURRENT_USER_KEY = 'user_id';
export const CURRENT_USER_ROLE = 'role';
export const CURRENT_TOKEN = 'fb_token';
export const CURRENT_GEOLOCATION = 'geolocation';
export const GEO_IS_HARDCODED = 'geolocation_hardcoded';
export const USER_DETAILS = 'user_details';
export const LOCATION_NOT_ALLOWED = 'location_not_allowed';
export const LOCATION_PERMISSION_DENIED = 'location_denied';
export const PUSH_NOTIFICATIONS_DENIED = 'push_denied';
export const PUSH_NOTIFICATIONS_ASKED = 'push_asked';
export const PUSH_NOTIFICATIONS_SCREEN_SHOWED = 'push_screen';
export const FIRST_TIME_OPEN = 'first-time';
export const CURRENT_SESSION_LOCATION = 'current-location';
export const CURRENT_PUSH_TOKEN = 'current-token';
export const CURRENT_RADIUS = 'current-radius';
export const COMPANY_PLACES = 'places';
export const COMPANY_DETAILS = 'company-details';

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
	ACTIVE: 'pending',
	TO_TAKE: 'to_take',
	PAYED: 'payed',
	CANCELLED: 'cancelled',
	COMPLETED: 'completed',
};

export const PRODUCT_STATUSES = {
	ACTIVE: 'active',
	UNPUBLISHED: 'unpublished',
	OUT_OF_STOCK: 'out of stock',
	EXPIRED: 'expired',
};

export const PAYMENT_TYPES = {
	CASH: 'cash',
	CARD: 'card',
};

export const DEFAULT_RADIUS = 10;

export const PLACEHOLDER =
	'https://niamka.s3.eu-central-1.amazonaws.com/images/default/placeholder_.jpg';
