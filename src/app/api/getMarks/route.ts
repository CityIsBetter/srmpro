// getMarks route.ts
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
    await page.waitForSelector('table[border="1"]');

    // Extract Marks Details
    const marksDetails = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table:nth-of-type(4) tbody tr'));
      const marks = rows.slice(1).map(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) return null;

        const courseCode = cells[0]?.textContent?.trim() || 'N/A';
        const courseType = cells[1]?.textContent?.trim() || 'N/A';

        const testPerformance = Array.from(cells[2]?.querySelectorAll('table tr') || []).map(testRow => {
          const testCells = testRow.querySelectorAll('td');
          return {
            testName: testCells[0]?.textContent?.trim() || 'N/A',
            testScore: testCells[1]?.textContent?.trim() || 'N/A',
          };
        });

        return {
          courseCode,
          courseType,
          testPerformance,
        };
      }).filter(detail => detail !== null);

      return marks;
    });

    await browser.close();

    // Set cookie with the fetched data
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiration
    const cookie = `marksDetails=${JSON.stringify(marksDetails)}; expires=${expires.toUTCString()}; path=/;`;
    const response = NextResponse.json({ marksDetails });
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch marks. ' + error.message }, { status: 500 });
  }
}
