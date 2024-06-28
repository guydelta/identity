import { CountryCode, countryCodeToIdentityNumberPattern, countryCodeToPassportNumberPattern } from "./dictionaries";
export type ValidationStatus = 'Valid' | 'Invalid' | 'Unknown';

/**
 * @description Takes an identity number and checks in which countries it is valid
 * @param identityNumber 
 */
export function validateIdentityNumberForAllCountries(identityNumber: string): {
    status: ValidationStatus;
    countryCodeActual: CountryCode[];
} {
    let status: ValidationStatus = 'Invalid';
    const countries: CountryCode[] = [];
    for (const key of Object.keys(countryCodeToIdentityNumberPattern)) {
        const validity = validateIdentityNumberForCountry(identityNumber, key as CountryCode);
        if (validity === 'Valid') {
            status = 'Valid';
            countries.push(key as CountryCode);
        }
    }

    return {
        status,
        countryCodeActual: countries
    }
}

/**
 * @description Takes a passport number and checks in which countries it is valid.
 * @param passportNumber 
 */
export function validatePassportNumberForAllCountries(passportNumber: string): {
    status: ValidationStatus;
    countryCodeActual: CountryCode[];
} {
    let status: ValidationStatus = 'Invalid';
    const countries: CountryCode[] = [];
    for (const key of Object.keys(countryCodeToPassportNumberPattern)) {
        const validity = validatePassportNumberForCountry(passportNumber, key as CountryCode);
        if (validity === 'Valid') {
            status = 'Valid';
            countries.push(key as CountryCode);
        }
    }

    return {
        status,
        countryCodeActual: countries
    }
}

/**
 * @description does basic validation for an identity number against a specific country
 * @param identityNumber 
 * @param countryCode 
 * @returns Valid | Invalid | Unknown
 */
export function validateIdentityNumberForCountry(identityNumber: string, countryCode: CountryCode): ValidationStatus {
    let valid = false;
    for (const validator of countryCodeToIdentityNumberPattern[countryCode]) {
        if (valid) continue;
        valid = validator.test(identityNumber);
    }

    if (!valid) {
        return 'Invalid';
    }

    // If there is additional work to be done, e.g. parity checks, do it here
    switch (countryCode) {
        case 'CA':
        case 'ZA':
            return luhnCheck(identityNumber) ? 'Valid' : 'Invalid';
        case 'UK':
        case 'US':
            return 'Valid';
        default:
            return 'Unknown';
    }
}

/**
 * @description does basic validation for a passport number against a specific country
 * @param passportNumber 
 * @param countryCode 
 * @returns Valid | Invalid | Unknown
 */
export function validatePassportNumberForCountry(passportNumber: string, countryCode: CountryCode): ValidationStatus {
    let valid = false;
    for (const validator of countryCodeToPassportNumberPattern[countryCode]) {
        if (valid) continue;
        valid = validator.test(passportNumber);
    }
    return valid ? 'Valid' : 'Invalid';
}

/**
 * @description validates the identity number using the Luhn Algorithm
 * @param identityNumber 
 */
function luhnCheck(identityNumber: string): boolean {
    let sum = 0;
    let alternate = false;

    for (let i = identityNumber.length - 1; i >= 0; i--) {
        let n = parseInt(identityNumber.charAt(i), 10);
        if (alternate) {
            n *= 2;
            if (n > 9) {
                n = (n % 10) + 1;
            }
        }
        sum += n;
        alternate = !alternate;
    }

    return (sum % 10 === 0);
}