// getAttendance route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie provided' }, { status: 400 });
    }

    // Split session cookie into individual cookies
    const cookiesArray = sessionCookie.split('; ').map(cookieStr => {
      const [name, value] = cookieStr.split('=');
      return { name, value, domain: 'academia.srmist.edu.in', path: '/' };
    });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set cookies before navigating
    await page.setCookie(...cookiesArray);

    await page.goto('https://academia.srmist.edu.in/#Page:My_Attendance');
    await page.waitForSelector('#zc-viewcontainer_My_Attendance');

    // Extract Course Details
    const courseDetails = await page.evaluate(() => {
      const tables = document.querySelectorAll('table:nth-of-type(3) tbody');
      if (!tables.length) return null;

      const courses: any[] = [];

      tables.forEach((table) => {
        const rows = table.querySelectorAll('tr');

        rows.forEach((row, index) => {
          if (index === 0) return; // Skip header row if exists

          const columns = row.querySelectorAll('td');
          if (columns.length < 8) return; // Ensure there are enough columns

          const course = {
            courseTitle: columns[1]?.textContent?.trim() || 'N/A',
            courseCode: columns[0]?.textContent?.trim() || 'N/A',
            courseCategory: columns[2]?.textContent?.trim() || 'N/A',
            facultyName: columns[3]?.textContent?.trim() || 'N/A',
            hoursConducted: columns[5]?.textContent?.trim() || 'N/A',
            hoursAbsent: columns[6]?.textContent?.trim() || 'N/A',
            attendancePercentage: columns[7]?.textContent?.trim() || 'N/A',
          };

          courses.push(course);
        });
      });

      return courses;
    });

    await browser.close();

    // Set cookie with the fetched data
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiration
    const cookie = `courseDetails=${JSON.stringify(courseDetails)}; expires=${expires.toUTCString()}; path=/;`;
    const response = NextResponse.json({ courseDetails });
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error('Error fetching attendance details:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance details.' }, { status: 500 });
  }
}
