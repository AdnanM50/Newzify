import { z } from 'zod';

export const USER_ROLE = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
    USER: 'user',
} as const;

export const USER_ROLE_ENUM: string[] = Object.values(USER_ROLE);
export const USER_GENDER_ENUM: string[] = ['male', 'female'];

export const dictionary: number[] = [
    49, //1
    50, //2
    51, //3
    52, //4
    53, //5
    54, //6
    56, //7
    55, //8
    57, //9
    65, //A
    66, //B
    67, //C
    68, //D
    69, //E
    70, //F
    71, //G
    72, //H
    74, //J
    75, //K
    76, //L
    77, //M
    78, //N
    80, //P
    81, //Q
    82, //R
    83, //S
    84, //T
    85, //U
    86, //V
    87, //W
    88, //X
    89, //Y
    90, //Z
];

interface ITheme {
    name: string;
    isDefault: boolean;
}
export const AdminTheme: ITheme[] = [
    {
        name: 'home1',
        isDefault: true,
    },
    {
        name: 'home2',
        isDefault: false,
    },
    {
        name: 'home3',
        isDefault: false,
    },
];

export const languageEnum = z.enum([
    'en',
    'bn',
    'es',
    'fr',
    'de',
    'zh',
    'ja',
    'ru',
    'pt',
    'it',
    'ar',
    'ko',
    'hi',
    'tr',
    'nl',
    'sv',
    'da',
    'no',
    'fi',
    'el',
    'th',
    'he',
    'cs',
    'hu',
    'ro',
    'sk',
    'bg',
    'vi',
    'ms',
    'id',
    'tl',
    'sw',
]);

export const countryEnum = z.enum([
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CHF',
    'CAD',
    'AUD',
    'CNY',
    'INR',
    'BRL',
    'ZAR',
    'MXN',
    'SGD',
    'HKD',
    'NZD',
    'RUB',
    'TRY',
    'KRW',
    'SEK',
    'NOK',
    'DKK',
    'THB',
    'ILS',
    'PHP',
    'MYR',
    'VND',
    'IDR',
    'COP',
    'CLP',
    'CZK',
    'HUF',
    'RON',
    'BGN',
    'AED',
    'QAR',
    'SAR',
    'OMR',
    'KWD',
    'BHD',
    'JOD',
    'AMD',
    'GEL',
    'KZT',
    'UZS',
    'TWD',
    'PKR',
    'NPR',
    'MNT',
    'DOP',
    'PEN',
    'BAM',
    'HRK',
    'ISK',
    'MDL',
    'LTL',
    'LVL',
    'AZN',
    'XOF',
    'XAF',
    'XPF',
    'SCR',
    'SLL',
    'SOS',
    'TJS',
    'KGS',
    'AFN',
    'LKR',
    'BBD',
    'JMD',
    'TTD',
    'XCD',
    'KYD',
    'BMD',
    'FJD',
    'WST',
    'PGK',
    'VUV',
    'XDR',
]);
