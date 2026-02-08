import * as bus from './agents/bus';
import { calendarTools } from './agents/calendar';

export const alltools = {
    ...bus,
    ...calendarTools
};  