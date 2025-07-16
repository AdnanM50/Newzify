import { Model } from 'mongoose';
import { dictionary } from './constant';

export const generateRandomNumber = (lenght: number = 8, max: number) => {
    const randomNumber = [];
    for (let i = 0; i < lenght; i++) {
        randomNumber.push(dictionary[Math.round(Math.random() * max)]);
    }
    return randomNumber;
};

export const generateID = (prefix: string, lenght: number) => {
    return prefix + String.fromCharCode(...generateRandomNumber(10, lenght));
};
// @ts-ignore
export const generateTransactionID = async (
    prefix: string,
    model: Model<any>,
) => {
    const randomString =
        prefix + String.fromCharCode(...generateRandomNumber(7, 32));
    const exists = await model.findOne({
        transaction_id: randomString,
    });
    if (exists) {
        console.error('Matched!', randomString);
        return await generateTransactionID(prefix, model);
    }
    return randomString;
};
// @ts-ignore
export const generateTicketID = async (prefix: string) => {
    // const randomString =
    //     prefix + String.fromCharCode(...generateRandomNumber(7, 32));
    // const exists = await EventBooking.findOne({
    //     ticket: randomString,
    // });
    // if (exists) {
    //     console.error('Matched!', randomString);
    //     return await generateTicketID(prefix);
    // }
    // return randomString;
};
