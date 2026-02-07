import { NextRequest, NextResponse } from 'next/server';
import UserAgent from 'user-agents';

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



export async function GET(
  request,
  { params }
) {
  const { city } = params;

  if (!city) {
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
    
    const URL_Trains = `https://erail.in/rail/getTrains.aspx?Station_From=${city}&Station_To=${city}&DataSource=0&Language=0&Cache=true`;
    
    const response = await fetch(URL_Trains, {
      method: "GET",
      headers: { 
        "User-Agent": userAgent.toString(),
      },
    });

    const data = await response.text();
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