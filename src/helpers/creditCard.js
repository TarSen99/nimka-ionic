export const CREDIT_NUMBER_LENGTH = 16;
export const DATE_LENGTH = 4;
export const CVC_LENGTH = 3;

export const formatCreditCard = (v) => {
	let res = '';
	const valueWithoutSpaces = v.replace(/\s/g, '');
	const withMaxLength = valueWithoutSpaces.slice(0, CREDIT_NUMBER_LENGTH);

	for (let i = 0; i < withMaxLength.length; i++) {
		if (i % 4 === 0 && i !== 0) {
			res += ` ${withMaxLength[i]}`;
			continue;
		}

		res += withMaxLength[i];
	}

	return res;
};

export const formatDate = (v) => {
	let res = '';
	const valueWithoutSpaces = v.replace(/\s/g, '');
	const valueWithoutSlash = valueWithoutSpaces.replace('/', '');

	const withMaxLength = valueWithoutSlash.slice(0, DATE_LENGTH);

	for (let i = 0; i < withMaxLength.length; i++) {
        const checkIfNum = +withMaxLength[i]
        if(!checkIfNum && checkIfNum !== 0) {
            continue
        }

		if (i % 2 === 0 && i !== 0) {
			res += `/${withMaxLength[i]}`;
			continue;
		}

		res += withMaxLength[i];
	}

	return res;
};

export const formatCvc = (v) => {
	let res = '';
	const valueWithoutSpaces = v.replace(/\s/g, '');
	const withMaxLength = valueWithoutSpaces.slice(0, CVC_LENGTH);

	for (let i = 0; i < withMaxLength.length; i++) {
        const v = +withMaxLength[i]
        if(!v && v !== 0) {
            continue
        }

        res += v
	}

	return res;
};
