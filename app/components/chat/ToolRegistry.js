import { BusRoutesTool } from './tools/BusRoutesTool';
import { SearchCityTool } from './tools/SearchCityTool';
import { GetTodayDateTool } from './tools/GetTodayDateTool';

export const ToolRegistry = {
    'getBusRoutes': BusRoutesTool,
    'searchCity': SearchCityTool,
    'getTodayDate': GetTodayDateTool,
};
