import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { getSupabasePlus } from '@/app/lib/supabaseServer';

export async function GET(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;

    const supabase = await getSupabasePlus();
    const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    const body = await req.json();

    const { destination, start_date, end_date, status, total_cost, image_url, review, itinerary } = body;

    const supabase = await getSupabasePlus();
    const { data, error } = await supabase
        .from('trips')
        .insert([
            {
                user_id: userId,
                destination,
                start_date,
                end_date,
                status,
                total_cost,
                image_url,
                review,
                itinerary
            }
        ])
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
}

export async function PUT(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, review, status, itinerary } = body;

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const updates = {};
    if (review !== undefined) updates.review = review;
    if (status !== undefined) updates.status = status;
    if (itinerary !== undefined) updates.itinerary = itinerary;

    const supabase = await getSupabasePlus();
    const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .eq('user_id', session.user.id || session.user.email)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
}

export async function DELETE(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const supabase = await getSupabasePlus();
    const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id || session.user.email);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
