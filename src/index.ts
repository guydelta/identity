import { CountryCode, countryCodeToTypeLabel } from "./dictionaries";
import { ParsedMetadata, parseIdentityNumberForCountry } from "./parsers";
import { ValidationStatus, validateIdentityNumberForAllCountries, validateIdentityNumberForCountry, validatePassportNumberForAllCountries, validatePassportNumberForCountry } from "./validators";

type IdentifierType = 'National Identity' | 'Passport';

interface ValidationResult {
    /**
     * @description The ISO3166 alpha-2 country code(s) where the provided identity number matches
     */
    countryCodeActual: CountryCode[];
    /**
     * @description The original country code request that was passed into the validator
     */
    countryCodeExpected: CountryCode | 'auto';
    identityNumber: string;
    /**
     * @description If any additional information is encoded in the identity number, it will appear in the meta object
     */
    meta?: Partial<ParsedMetadata> | undefined;
    /**
     * @description Valid if the identifier matches the patterns provided by any given country, and also, where required, passes the parity checks, Invalid if the checks fail, and Unknown when validity cannot be guaranteed
     */
    status: ValidationStatus;
    /**
     * @description National Identity refers the the (mostly) unique identifier provided by a nation to identify their citizens
     */
    type: IdentifierType;
    /**
     * @description In order to distinguish between different forms of national identity numbers, an additional identifier label indicates the usual in-country name for this identifier
     */
    typeLabel: string;
}

/**
 * 
 * @param identityNumber The identity number that should be validated and parsed
 * @param countryCode If auto, then the validator will attempt to find all the countries where the identity number match, and validate against each of them. Otherwise, it will attempt to match against the specific country's validator
 * @param type "National Identity" or "Passport", where "National Identity" is the default value, this indicates the type of number provided and the dictionary it should validate against
 */
export function parseId(identityNumber: string, countryCode: CountryCode | 'auto' = 'auto', type: IdentifierType = 'National Identity'): ValidationResult {
    const results = validateId(identityNumber, countryCode, type);
    if (results.status === 'Invalid' || !results.countryCodeActual.length) {
        return results;
    }
    results.meta = parseIdentityNumberForCountry(identityNumber, results.countryCodeActual);
    return results;
}

/**
 * 
 * @param identityNumber The identity number that should be validated
 * @param countryCode If auto, then the validator will attempt to find all the countries where the identity number match, and validate against each of them. Otherwise, it will attempt to match against the specific country's validator
 * @param type "National Identity" or "Passport", where "National Identity" is the default value, this indicates the type of number provided and the dictionary it should validate against
 * @returns 
 */
export function validateId(identityNumber: string, countryCode: CountryCode | 'auto' = 'auto', type: IdentifierType = 'National Identity'): ValidationResult {
    const result = {
        countryCodeExpected: countryCode,
        identityNumber: identityNumber.split(' ').join(''),
        status: 'Unknown',
        type,
        typeLabel: type === 'Passport' ? 'Passport' : (countryCode === 'auto' ? 'Other' : countryCodeToTypeLabel[countryCode]),
        countryCodeActual: countryCode === 'auto' ? [] : [countryCode],
    } as ValidationResult;


    if (countryCode !== 'auto' && type === 'National Identity') {
        result.status = validateIdentityNumberForCountry(identityNumber, countryCode);
    } else if (countryCode !== 'auto' && type === 'Passport') {
        result.status = validatePassportNumberForCountry(identityNumber, countryCode);
    } else if (countryCode === 'auto' && type === 'National Identity') {
        const validation = validateIdentityNumberForAllCountries(identityNumber);
        result.status = validation.status;
        result.countryCodeActual = validation.countryCodeActual;
    } else {
        const validation = validatePassportNumberForAllCountries(identityNumber);
        result.status = validation.status;
        result.countryCodeActual = validation.countryCodeActual;
    }

    if (result.countryCodeActual.length && result.typeLabel === 'Other') {
        result.typeLabel = countryCodeToTypeLabel[result.countryCodeActual[0]];
    }


    return result;

}