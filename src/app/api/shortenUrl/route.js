import { nanoid } from 'nanoid';
import dbConnect from '../../utils/dbConnect';
import Url from '../../models/Url'; 
import { NextResponse } from 'next/server';
import { verifyKey } from 'grantx_sdk';

export async function POST(req) {
  await dbConnect();

  try {
    const { originalUrl, apiKey } = await req.json();
    const response = await verifyKey(apiKey);
    if (!response.valid) {
        
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    const shortId = nanoid(8);


    const newUrl = await Url.create({
      shortId,
      originalUrl,
    });

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortId}`;

    return NextResponse.json({ shortUrl, apikey: 'valid' }, { status: 201 });
  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
