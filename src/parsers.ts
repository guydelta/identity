import { CountryCode, countryCodeToIdentityNumberPattern } from "./dictionaries";

type Citizenship = 'Citizen' | 'Permanent Resident' | 'Temporary Resident' | 'Other';
type Gender = 'Male' | 'Female' | 'Unknown';

export interface ParsedMetadata {
    /**
     * @description A helper to indicate the current age of the person in the case the date of birth was encoded in the identity number
     */
    age: number;
    /**
     * @description Some national identifiers would indicate the region/province/state/area within the country where the person's identity number was registered or where the person was born
     */
    area: string;
    /**
     * @description Certain countries that encodes birth date information in the identity number might also provide an indicator of which century the birth date belongs to. In the case where this identifier is absent, the identity number is limited to 100 years.
     */
    century: 1800 | 1900 | 2000;
    /**
     * @description Refers to the natural citizen status of a resident
     */
    citizenship: Citizenship;
    /**
     * The date of birth encoded in the identity number, provided in the Extended ISO 8601 format
     */
    dateOfBirth: string;
    /**
     * @description Many countries who identifies gender as part of the information encoded in the identity number uses the Male/Female only indicators
     */
    gender: Gender;
    /**
     * @description A number value that would be used for parity checks of the identity number to ensure the number is correctly constructed
     */
    parity: number;
    /**
     * @description Historically in certain countries this information was encoded in the identity number, most countries who used this pattern today ignores this value and instead uses a default indicator with no meaning
     */
    race: 'Unknown';
    /**
     * @description A sequential value associated with the user to differentiate from others that would exist on the same date/location
     */
    sequence: number;
}

/**
 * 
 * @param dateString The date part of the identity number, in this case in the format YYMMDD
 * @returns age in years
 */
function getAge(dateString: string): number {
    const birthdate = new Date(dateString);
    const today = new Date();

    // Calculate the age
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const dayDiff = today.getDate() - birthdate.getDate();

    // Adjust the age if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

/**
 * @description converts an identity date string to Extended ISO 8601 format
 * @param shortDate string in the format YYMMDD
 */
function parseShortDate(shortDate: string): string {
    const currentYear = new Date().getFullYear();
    const decadeYear = parseInt(currentYear.toString().slice(2), 10);

    const yy = parseInt(shortDate.slice(0, 2), 10);
    const mm = shortDate.slice(2, 4);
    const dd = shortDate.slice(4, 6);

    // Calculate the full year
    let fullYear = (yy < decadeYear ? 2000 : 1900) + yy;

    // Format the full year, month, and day into the format YYYY-MM-DD
    return `${fullYear.toString().padStart(4, '0')}-${mm}-${dd}`;
}

/**
 * 
 * @param identityNumber A Canadian Social Insurance Number
 */
function parseCA(identityNumber: string): Partial<ParsedMetadata> | undefined {
    for (const pattern of countryCodeToIdentityNumberPattern['CA']) {
        if (!pattern.test(identityNumber)) {
            continue;
        }
        const groups = identityNumber.match(pattern);
        if (!groups) {
            return;
        }

        const geographicDigit = parseInt(identityNumber[0]);
        let geography = '';
        let citizenship: Citizenship = 'Citizen';
        switch (geographicDigit) {
            case 1:
                geography = 'NS, NB, PE, NL';
                break;
            case 2:
            case 3:
                geography = 'QC';
                break;
            case 4:
            case 5:
                geography = 'ON';
                break;
            case 6:
                geography = 'NW ON, MB, SK, AB, NT, NU';
                break;
            case 7: 
                geography = 'BC, YT';
                break;
            case 8:
                geography = 'BN';
                citizenship = 'Other';
                break;
            case 9:
                geography = 'Temporary Resident';
                citizenship = 'Temporary Resident';
                break;
            default:
                geography = 'Tax Number';
                citizenship = 'Other';
                break;
        }

        const data: Partial<ParsedMetadata> = {
            area: geography,
            citizenship
        }
        return data;
    }
}

/**
 * 
 * @param identityNumber A South African Identity Number
 */
function parseZA(identityNumber: string): Partial<ParsedMetadata> | undefined {
    for (const pattern of countryCodeToIdentityNumberPattern['ZA']) {
        if (!pattern.test(identityNumber)) {
            continue;
        }
        const groups = identityNumber.match(pattern);
        if (!groups) {
            return;
        }
        const dateOfBirth = parseShortDate(groups[1] + groups[2] + groups[3]);
        const century = dateOfBirth.startsWith('19') ? 1900 : 2000;
        const age = getAge(dateOfBirth);
        const sequence = parseInt(groups[4], 10);
        const gender: Gender = sequence < 5000 ? 'Female' : 'Male';
        const citizenship: Citizenship = parseInt(groups[5], 10) === 0 ? 'Citizen' : 'Permanent Resident';
        const parity = parseInt(groups[7], 10);

        const data: Partial<ParsedMetadata> = {
            dateOfBirth,
            century,
            age,
            citizenship,
            gender,
            parity,
            race: "Unknown",
            sequence
        }
        return data;
    }
}

/**
 * 
 * @param identityNumber The UK identity number that should be parsed
 */
function parseUK(identityNumber: string): Partial<ParsedMetadata> | undefined {
    for (const pattern of countryCodeToIdentityNumberPattern['UK']) {
        if (!pattern.test(identityNumber)) {
            continue;
        }
        const groups = identityNumber.match(pattern);
        if (!groups) {
            return;
        }
        const sequence = parseInt(`${groups[2]}${groups[3]}${groups[4]}`, 10);
        const data: Partial<ParsedMetadata> = {
            sequence
        }
        return data;
    }
}

/**
 * 
 * @param identityNumber A US SSN
 */
function parseUS(identityNumber: string): Partial<ParsedMetadata> | undefined {
    for (const pattern of countryCodeToIdentityNumberPattern['US']) {
        if (!pattern.test(identityNumber)) {
            continue;
        }
        const groups = identityNumber.match(pattern);
        if (!groups) {
            return;
        }
        const sequence = parseInt(`${groups[3]}`, 10);
        const data: Partial<ParsedMetadata> = {
            sequence
        }
        return data;
    }
}


/**
 * @description Parses
 * @param identityNumber The identity number that should be parsed
 * @param countryCodes An array of possible country codes against which the number should be parsed.
 */
export function parseIdentityNumberForCountry(identityNumber: string, countryCodes: CountryCode[]): Partial<ParsedMetadata> | undefined {
    if (!identityNumber || !countryCodes.length) return;
    for (const countryCode of countryCodes) {
        switch (countryCode) {
            case 'CA':
                return parseCA(identityNumber);
            case 'ZA':
                return parseZA(identityNumber);
            case 'UK':
                return parseUK(identityNumber);
            case 'US':
                return parseUS(identityNumber);
            default:
                break;
        }
    }
}