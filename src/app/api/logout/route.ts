// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.delete('session'); // Delete the session cookie
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to logout.' }, { status: 500 });
  }
}
