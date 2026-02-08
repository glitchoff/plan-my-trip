import { BusRoutesTool } from './tools/BusRoutesTool';
import { SearchCityTool } from './tools/SearchCityTool';
import { GetTodayDateTool } from './tools/GetTodayDateTool';
import { SearchTrainsTool } from './tools/SearchTrainsTool';
import { GetTrainRouteDetailsTool } from './tools/GetTrainRouteDetailsTool';
import { GetCoordinatesTool } from './tools/GetCoordinatesTool';
import { GetLocationDetailsTool } from './tools/GetLocationDetailsTool';

export const ToolRegistry = {
    'getBusRoutes': BusRoutesTool,
    'searchCity': SearchCityTool,
    'getTodayDate': GetTodayDateTool,
    'searchTrains': SearchTrainsTool,
    'getTrainRouteDetails': GetTrainRouteDetailsTool,
    'getCoordinates': GetCoordinatesTool,
    'getLocationDetails': GetLocationDetailsTool,
};
