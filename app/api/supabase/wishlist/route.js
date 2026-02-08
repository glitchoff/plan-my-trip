import { NextResponse } from 'next/server';
import { auth } from "@/auth"; // Use auth helper
import { getSupabasePlus } from '@/app/lib/supabaseServer';

export async function GET(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id || session.user.email; // Fallback to email if ID not present

    const supabase = await getSupabasePlus();
    const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

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

    const { place_name, location, rating, price, image_url, details } = body;

    const supabase = await getSupabasePlus();
    const { data, error } = await supabase
        .from('wishlist')
        .insert([
            {
                user_id: userId,
                place_name,
                location,
                rating,
                price: String(price), // Ensure price is string as per schema
                image_url,
                details
            }
        ])
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
        .from('wishlist')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id || session.user.email); // Ensure user owns the item

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
