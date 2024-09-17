// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  // Declare the browser variable outside the try block
  let browser;

  try {
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    // Initialize the browser here, but in the outer scope
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://academia.srmist.edu.in/', { waitUntil: 'networkidle2' });

    const iframeElement = await page.waitForSelector('iframe[name="zohoiam"]');
    const iframe = await iframeElement?.contentFrame();
    if (!iframe) throw new Error('Failed to access the login iframe');

    // Perform login
    await iframe.waitForSelector('#login_id');
    await iframe.type('#login_id', username);
    await iframe.click('#nextbtn');
    await iframe.waitForSelector('#password', { visible: true });
    await iframe.type('#password', password);
    await iframe.click('#nextbtn');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const currentUrl = page.url();
    if (currentUrl.includes('loginfailed') || currentUrl === 'https://academia.srmist.edu.in/') {
      await browser.close();
      return NextResponse.json({ error: 'Invalid credentials or login failed.' }, { status: 401 });
    }

    // Get the cookies
    const cookies = await page.cookies();
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    // Close the browser
    await browser.close();

    // Set the session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', cookieString, { httpOnly: true, maxAge: 168 * 60 * 60 }); 

    return response;
  } catch (error) {
    console.error('Login error:', error);

    // Close the browser if it's still open
    if (browser) {
      await browser.close();
    }

    return NextResponse.json({ error: 'An error occurred while logging in.' }, { status: 500 });
  }
}
