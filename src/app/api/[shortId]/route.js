import dbConnect from '../../utils/dbConnect';
import Url from '../../models/Url'; 
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();
  const { shortId } = params;
  
  try {
    const urlDoc = await Url.findOne({ shortId });

    if (!urlDoc) {
      return NextResponse.json({ status: 404, message: 'URL not found' });
    }
    
    const originalUrl = urlDoc.originalUrl;
    return NextResponse.json({ url: originalUrl }, { status: 200 });
  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json({ status: 500, message: 'Server Error' });
  }
}
