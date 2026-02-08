import { NextResponse } from 'next/server';
import { getTrainsBetweenStations, getTrainsOnDate, getTrainRoute } from '@/app/lib/train-api';

// ==================== API HANDLERS ====================

// 1. GET TRAINS BETWEEN TWO STATIONS
async function handleBetweenStations(from, to) {
  try {
    const json = await getTrainsBetweenStations(from, to);
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: error.message
      },
      { status: error.message.includes("Missing") ? 400 : 500 }
    );
  }
}

// 2. GET TRAINS ON SPECIFIC DATE
async function handleGetTrainOn(from, to, date) {
  try {
    const json = await getTrainsOnDate(from, to, date);
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: error.message
      },
      { status: error.message.includes("Missing") ? 400 : 500 }
    );
  }
}

// 3. GET TRAIN ROUTE
async function handleGetRoute(trainNo) {
  try {
    const json = await getTrainRoute(trainNo);
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        time_stamp: Date.now(),
        data: error.message
      },
      { status: error.message.includes("Missing") ? 400 : 500 }
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