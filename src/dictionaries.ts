export type CountryCode = 'UK'|'ZA'|'US';

export interface CountryCodeToTypeLabel {
    [countryCode: string]: string;
}

export interface CountryCodeToPatterns {
    [countryCode: string]: RegExp[];
}

export interface PatternToCountryCodes {
    [pattern: string]: CountryCode[];
}

export const countryCodeToIdentityNumberPattern: CountryCodeToPatterns = {
    'ZA': [/^(?<year>\d{2})(?<month>0[1-9]|1[0-2])(?<day>0[1-9]|[1-2][0-9]|3[0-1])(?<gender>\d{4})(?<citizenship>\d)(?<race>\d)(?<checksum>\d)$/],
    'UK': [/^(?<prefix>!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?<suffix>[A-D]?$/],
    'US': [/^(?<area>!000|666|9\d{2})\d{3}-(?<group>!00)\d{2}-(?<serial>!0000)\d{4}$/]
}

export const identityNumberPatternToCountryCodes: PatternToCountryCodes = {
    "^(?<year>\\d{2})(?<month>0[1-9]|1[0-2])(?<day>0[1-9]|[1-2][0-9]|3[0-1])(?<gender>\\d{4})(?<citizenship>\\d)(?<race>\\d)(?<checksum>\\d)$": ['ZA'],
    "^(?<prefix>!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{2}\\s?\\d{2}\\s?\\d{2}\\s?\\d{2}\\s?<suffix>[A-D]?$": ['UK'],
    "^(?<area>!000|666|9\\d{2})\\d{3}-(?<group>!00)\\d{2}-(?<serial>!0000)\\d{4}$": ['US']
}

export const countryCodeToPassportNumberPattern: CountryCodeToPatterns = {
    'ZA': [/^[A-Z]\d{8}$/],
    'US': [/^[A-Z0-9]{9}$/],
    'UK': [/^[0-9]{9}$/, /^[A-Z]{2}[0-9]{7}$/]
}

export const passportNumberPatternToCountryCodes: PatternToCountryCodes = {
    "^[A-Z]\\d{8}$": ['ZA'],
    "^[A-Z0-9]{9}$": ['US'],
    "^[0-9]{9}$": ['UK'],
    "^[A-Z]{2}[0-9]{7}$": ['UK']
}

export const countryCodeToTypeLabel: CountryCodeToTypeLabel = {
    'ZA': 'National Identity Number',
    'US': 'Social Security Number',
    'UK': 'National Insurance Number'
}