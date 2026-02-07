import { NextRequest, NextResponse } from 'next/server';
import UserAgent from 'user-agents';

// You'll need to create this utility class for Next.js
class Prettify {
  GetRoute(string) {
    try {
      let data = string.split("~^");
      let arr = [];
      let obj = {};
      let retval = {};
      for (let i = 0; i < data.length; i++) {
        let data1 = data[i].split("~");
        data1 = data1.filter((el) => {
          return el != "";
        });
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
      return {
        success: false,
        time_stamp: Date.now(),
        data: err.message,
      };
    }
  }
}

const prettify = new Prettify();

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const cityName = searchParams.get('city');

  if (!cityName) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: "Please provide a city name",
      },
      { status: 400 }
    );
  }

  try {
    const userAgent = new UserAgent();
    
    // First, fetch train data to get the station code
    const URL_Trains = `https://erail.in/rail/getTrains.aspx?Station_From=${cityName}&Station_To=${cityName}&DataSource=0&Language=0&Cache=true`;
    
    const response = await fetch(URL_Trains, {
      method: "GET",
      headers: { 
        "User-Agent": userAgent.toString(),
      },
    });

    const data = await response.text();
    
    // Parse the response to extract station information
    const json = prettify.GetRoute(data);
    
    if (!json.success) {
      return NextResponse.json(
        {
          success: false,
          time_stamp: Date.now(),
          data: "Station not found for the given city",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: error.message,
      },
      { status: 500 }
    );
  }
}