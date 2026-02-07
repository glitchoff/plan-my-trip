import { NextResponse } from 'next/server';
import UserAgent from 'user-agents';

// Utility functions for parsing
class TrainDataParser {
  BetweenStation(string) {
    try {
      let obj = {};
      let retval = {};
      let arr = [];
      let obj2 = {};
      let data = string.split("~~~~~~~~");
      let nore = data[0].split("~");
      nore = nore[5].split("<");
      
      if (nore[0] == "No direct trains found") {
        retval["success"] = false;
        retval["time_stamp"] = Date.now();
        retval["data"] = nore[0];
        return retval;
      }
      
      if (
        data[0] === "~~~~~Please try again after some time." ||
        data[0] === "~~~~~From station not found" ||
        data[0] === "~~~~~To station not found"
      ) {
        retval["success"] = false;
        retval["time_stamp"] = Date.now();
        retval["data"] = data[0].replaceAll("~", "");
        return retval;
      }
      
      data = data.filter((el) => el != "");
      
      for (let i = 0; i < data.length; i++) {
        let data1 = data[i].split("~^");
        if (data1.length === 2) {
          data1 = data1[1].split("~");
          data1 = data1.filter((el) => el != "");
          
          obj["train_no"] = data1[0];
          obj["train_name"] = data1[1];
          obj["source_stn_name"] = data1[2];
          obj["source_stn_code"] = data1[3];
          obj["dstn_stn_name"] = data1[4];
          obj["dstn_stn_code"] = data1[5];
          obj["from_stn_name"] = data1[6];
          obj["from_stn_code"] = data1[7];
          obj["to_stn_name"] = data1[8];
          obj["to_stn_code"] = data1[9];
          obj["from_time"] = data1[10];
          obj["to_time"] = data1[11];
          obj["travel_time"] = data1[12];
          obj["running_days"] = data1[13];
          
          obj2["train_base"] = obj;
          arr.push(obj2);
          obj = {};
          obj2 = {};
        }
      }
      
      retval["success"] = true;
      retval["time_stamp"] = Date.now();
      retval["data"] = arr;
      return retval;
    } catch (err) {
      console.warn(err.message);
      return {
        success: false,
        time_stamp: Date.now(),
        data: err.message
      };
    }
  }

  GetRoute(string) {
    try {
      let data = string.split("~^");
      let arr = [];
      let obj = {};
      let retval = {};
      
      for (let i = 0; i < data.length; i++) {
        let data1 = data[i].split("~");
        data1 = data1.filter((el) => el != "");
        
        obj["source_stn_name"] = data1[2];
        obj["source_stn_code"] = data1[1];
        obj["arrive"] = data1[3];
        obj["depart"] = data1[4];
        obj["distance"] = data1[6];
        obj["day"] = data1[7];
        obj["zone"] = data1[9];
        
        arr.push(obj);
        obj = {};
      }
      
      retval["success"] = true;
      retval["time_stamp"] = Date.now();
      retval["data"] = arr;
      return retval;
    } catch (err) {
      console.log(err.message);
      return {
        success: false,
        time_stamp: Date.now(),
        data: err.message
      };
    }
  }

  getDayOnDate(DD, MM, YYYY) {
    let date = new Date(YYYY, MM, DD);
    let day =
      date.getDay() >= 0 && date.getDay() <= 2
        ? date.getDay() + 4
        : date.getDay() - 3;
    return day;
  }

  CheckTrain(string) {
    try {
      let data = string.split("~~~~~~~~");
      let nore = data[0].split("~");
      nore = nore[5].split("<");
      
      if (nore[0] == "Invalid Train Number") {
        return {
          success: false,
          time_stamp: Date.now(),
          data: "Invalid Train Number"
        };
      }
      
      let trainData = data[0].split("~^");
      if (trainData.length > 1) {
        trainData = trainData[1].split("~");
        trainData = trainData.filter((el) => el != "");
        
        return {
          success: true,
          time_stamp: Date.now(),
          data: {
            train_id: trainData[0],
            train_no: trainData[0],
            train_name: trainData[1]
          }
        };
      }
      
      return {
        success: false,
        time_stamp: Date.now(),
        data: "Unable to parse train data"
      };
    } catch (err) {
      return {
        success: false,
        time_stamp: Date.now(),
        data: err.message
      };
    }
  }
}

const parser = new TrainDataParser();

// Helper to fetch data with User-Agent
async function fetchTrainData(url, useUserAgent = false) {
  const headers = {};
  
  if (useUserAgent) {
    const userAgent = new UserAgent();
    headers['User-Agent'] = userAgent.toString();
  }
  
  const response = await fetch(url, { headers });
  return response.text();
}

// ==================== API HANDLERS ====================

// 1. GET TRAINS BETWEEN TWO STATIONS
async function handleBetweenStations(from, to) {
  if (!from || !to) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: "Missing required parameters: from, to"
      },
      { status: 400 }
    );
  }

  try {
    const url = `https://erail.in/rail/getTrains.aspx?Station_From=${from}&Station_To=${to}&DataSource=0&Language=0&Cache=true`;
    const data = await fetchTrainData(url, true);
    const json = parser.BetweenStation(data);
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: error.message
      },
      { status: 500 }
    );
  }
}

// 2. GET TRAINS ON SPECIFIC DATE
async function handleGetTrainOn(from, to, date) {
  if (!from || !to || !date) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: "Missing required parameters: from, to, date (format: DD-MM-YYYY)"
      },
      { status: 400 }
    );
  }

  try {
    const url = `https://erail.in/rail/getTrains.aspx?Station_From=${from}&Station_To=${to}&DataSource=0&Language=0&Cache=true`;
    const data = await fetchTrainData(url, true);
    const json = parser.BetweenStation(data);

    if (!json.success) {
      return NextResponse.json(json);
    }

    // Filter by date
    const DD = date.split("-")[0];
    const MM = date.split("-")[1];
    const YYYY = date.split("-")[2];
    const day = parser.getDayOnDate(DD, MM, YYYY);

    const filteredTrains = json.data.filter((train) => {
      return train.train_base.running_days[day] == 1;
    });

    return NextResponse.json({
      success: true,
      time_stamp: Date.now(),
      data: filteredTrains
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: error.message
      },
      { status: 500 }
    );
  }
}

// 3. GET TRAIN ROUTE
async function handleGetRoute(trainNo) {
  if (!trainNo) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: "Missing required parameter: trainNo"
      },
      { status: 400 }
    );
  }

  try {
    let url = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNo}&DataSource=0&Language=0&Cache=true`;
    let data = await fetchTrainData(url);
    let json = parser.CheckTrain(data);

    if (!json.success) {
      return NextResponse.json(json);
    }

    // Fetch route details
    url = `https://erail.in/data.aspx?Action=TRAINROUTE&Password=2012&Data1=${json.data.train_id}&Data2=0&Cache=true`;
    data = await fetchTrainData(url);
    json = parser.GetRoute(data);

    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: error.message
      },
      { status: 500 }
    );
  }
}

// Main Route Handler
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'betweenStations':
      return handleBetweenStations(
        searchParams.get('from'),
        searchParams.get('to')
      );

    case 'getTrainOn':
      return handleGetTrainOn(
        searchParams.get('from'),
        searchParams.get('to'),
        searchParams.get('date')
      );

    case 'getRoute':
      return handleGetRoute(searchParams.get('trainNo'));

    default:
      return NextResponse.json(
        {
          success: false,
          time_stamp: Date.now(),
          data: "Invalid action. Use: betweenStations, getTrainOn, or getRoute"
        },
        { status: 400 }
      );
  }
}