// getDetails route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: NextRequest) {
  // Retrieve the session cookie from the request
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Session cookie missing' }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Split the sessionCookie string (which contains multiple cookies) into separate cookies
    const cookiesArray = sessionCookie.split('; ').map(cookieStr => {
      const [name, value] = cookieStr.split('=');
      return { name, value, domain: 'academia.srmist.edu.in', path: '/' };
    });

    // Set each cookie properly in Puppeteer
    await page.setCookie(...cookiesArray);

    // Navigate to the desired page
    await page.goto('https://academia.srmist.edu.in/#Page:My_Attendance');
    await page.waitForSelector('#zc-viewcontainer_My_Attendance');

    // Extract Registration Details
    const registrationDetails = await page.evaluate(() => {
      const table = document.querySelector('table:nth-of-type(2)');
      if (!table) return null;

      const rows = table.querySelectorAll('tr');
      if (rows.length < 8) return null;

      return {
        registrationNumber: rows[2]?.querySelector('td:nth-child(2)')?.textContent?.trim() || 'N/A',
        name: rows[3]?.querySelector('td:nth-child(2)')?.textContent?.trim() || 'N/A',
        program: rows[4]?.querySelector('td:nth-child(2)')?.textContent?.trim() || 'N/A',
        department: rows[5]?.querySelector('td:nth-child(2)')?.textContent?.trim() || 'N/A',
        specialization: rows[6]?.querySelector('td:nth-child(2)')?.textContent?.trim() || 'N/A',
        semester: rows[7]?.querySelector('td:nth-child(2)')?.textContent?.trim() || 'N/A',
        batch: rows[7]?.querySelector('td:nth-child(5)')?.textContent?.trim() || 'N/A',
      };
    });

    await browser.close();

    // Set cookie with the fetched data
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiration
    const cookie = `registrationDetails=${JSON.stringify(registrationDetails)}; expires=${expires.toUTCString()}; path=/;`;
    const response = NextResponse.json({ registrationDetails });
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch details. ' + error.message }, { status: 500 });
  }
}
