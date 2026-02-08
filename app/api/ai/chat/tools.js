import * as bus from './agents/bus';
import * as train from './agents/train';
import * as geocode from './agents/geocode';
import { calendarTools } from './agents/calendar';

export const alltools = {
    ...bus,
    ...train,
    ...geocode,
    ...calendarTools
};  