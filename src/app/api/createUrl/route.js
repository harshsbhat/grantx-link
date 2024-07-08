// pages/api/shorten-url.js

import { nanoid } from 'nanoid';
import dbConnect from '../../utils/dbConnect';
import Url from '../../models/Url'; // Assuming you have a Url model for MongoDB
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();

  try {
    const { originalUrl } = await req.json();

    const shortId = nanoid(8);

    // Create a new URL instance
    const newUrl = await Url.create({
      shortId,
      originalUrl,
    });

    // Construct the short URL
    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortId}`;

    return NextResponse.json({ shortUrl }, { status: 201 });
  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
