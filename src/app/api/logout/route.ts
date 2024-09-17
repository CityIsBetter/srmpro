// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.delete('session');
    response.cookies.delete('courseDetails'); // Delete the session cookie
    response.cookies.delete('marksDetails');
    response.cookies.delete('registrationDetails');
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to logout.' }, { status: 500 });
  }
}
