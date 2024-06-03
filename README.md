# Identity and Passport Number Validator

This module provides functions to validate and parse national identity numbers and passport numbers for various countries. It supports multiple identifier types and country codes, allowing you to determine the validity and extract metadata from the provided numbers.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [validateId](#validateid)
  - [parseId](#parseid)
- [Supported Countries](#supported-countries)
- [Types](#types)
- [Examples](#examples)

## Installation

### NPM
```bash
npx jsr add @guydelta/identity
```

### Deno
```bash
deno add @guydelta/identity
```

### Yarn
```bash
yarn dlx jsr add @guydelta/identity
```

### PNPM
```bash
pnpm dlx jsr add @guydelta/identity
```

### Bun
```bash
bun jsr add @guydelta/identity
```

## Usage


### validateId

The `validateId` function validates the provided identity or passport number against specified or automatically detected country codes.

#### Parameters

- `identityNumber` (string): The identity or passport number to validate.
- `countryCode` (CountryCode | 'auto'): The country code to validate against. Use 'auto' to detect the country automatically. Default is 'auto'.
- `type` (IdentifierType): The type of identifier, either 'National Identity' or 'Passport'. Default is 'National Identity'.

#### Returns

A `ValidationResult` object containing the validation status, expected and actual country codes, the identity number, and additional metadata if available.

#### Example

```typescript
import { validateId } from '@guydelta/identity';

const result = validateId('8001015009087', 'ZA', 'National Identity');
console.log(result);
```

### parseId

The `parseId` function validates the provided identity or passport number and parses additional metadata if the number is valid.

#### Parameters

- `identityNumber` (string): The identity or passport number to validate and parse.
- `countryCode` (CountryCode | 'auto'): The country code to validate against. Use 'auto' to detect the country automatically. Default is 'auto'.
- `type` (IdentifierType): The type of identifier, either 'National Identity' or 'Passport'. Default is 'National Identity'.

#### Returns

A `ValidationResult` object containing the validation status, expected and actual country codes, the identity number, and additional metadata if available.

#### Example

```typescript
import { parseId } from '@guydelta/identity';

const result = parseId('8001015009087', 'ZA', 'National Identity');
console.log(result);
```

## Supported Countries

Currently, the module supports the following countries:

- United Kingdom (UK)
- South Africa (ZA)
- United States (US)


## Examples

### Validate an Identity Number

```typescript
import { validateId } from '@guydelta/identity';

const result = validateId('8001015009087', 'ZA', 'National Identity');
console.log(result);
// Output example:
// {
//   countryCodeActual: ['ZA'],
//   countryCodeExpected: 'ZA',
//   identityNumber: '8001015009087',
//   status: 'Valid',
//   type: 'National Identity',
//   typeLabel: 'National Identity Number'
// }
```

### Validate a Passport Number

```typescript
import { validateId } from '@guydelta/identity';

const result = validateId('A12345678', 'ZA', 'Passport');
console.log(result);
// Output example:
// {
//   countryCodeActual: ['ZA'],
//   countryCodeExpected: 'ZA',
//   identityNumber: 'A12345678',
//   status: 'Valid',
//   type: 'Passport',
//   typeLabel: 'Passport'
// }
```

### Parse an Identity Number

```typescript
import { parseId } from '@guydelta/identity';

const result = parseId('8001015009087', 'ZA', 'National Identity');
console.log(result);
// Output example:
// {
//   countryCodeActual: ['ZA'],
//   countryCodeExpected: 'ZA',
//   identityNumber: '8001015009087',
//   meta: {
//     age: 43,
//     dateOfBirth: '1980-01-01',
//     century: 1900,
//     citizenship: 'Citizen',
//     gender: 'Male',
//     parity: 7,
//     race: 'Unknown',
//     sequence: 5009
//   },
//   status: 'Valid',
//   type: 'National Identity',
//   typeLabel: 'National Identity Number'
// }
```

## License

This module is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

For further questions or support, please open an issue at https://github.com/guydelta/identity.