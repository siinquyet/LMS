import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

// Listen for console messages
page.on('console', msg => {
  console.log(`[CONSOLE ${msg.type()}]: ${msg.text()}`);
});

// Listen for dialogs (alerts, confirms)
page.on('dialog', async dialog => {
  console.log(`[DIALOG ${dialog.type()}]: ${dialog.message()}`);
  await dialog.accept();
});

// Listen for requests
page.on('request', request => {
  if (request.url().includes('/api/')) {
    console.log(`[REQUEST]: ${request.method()} ${request.url()}`);
  }
});

page.on('response', response => {
  if (response.url().includes('/api/')) {
    console.log(`[RESPONSE]: ${response.status()} ${response.url()}`);
  }
});

try {
  // Go to login page first
  console.log('Navigating to login page...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

  // Fill in login form
  console.log('Logging in...');
  await page.fill('input[type="email"]', 'teacher@example.com');
  await page.fill('input[type="password"]', 'teacher');
  await page.click('button[type="submit"]');

  // Wait for navigation after login
  await page.waitForTimeout(2000);
  console.log('Current URL:', page.url());

  // Navigate to course edit page
  console.log('Navigating to course edit...');
  await page.goto('http://localhost:5173/teacher/courses/24/edit', { waitUntil: 'networkidle' });

  // Wait for content to load
  await page.waitForTimeout(2000);
  console.log('Current URL:', page.url());

  // Click on "Nội dung" section to show chapters
  console.log('Clicking on Nội dung section...');
  const contentSection = await page.locator('text=Nội dung').first();
  if (await contentSection.isVisible()) {
    await contentSection.click();
    await page.waitForTimeout(1000);
  }

  // Look for delete buttons
  console.log('Looking for delete buttons...');
  const deleteButtons = await page.locator('button[title="Xóa chương"]').all();
  console.log(`Found ${deleteButtons.length} delete chapter buttons`);

  const deleteLessonButtons = await page.locator('button[title="Xóa bài học"]').all();
  console.log(`Found ${deleteLessonButtons.length} delete lesson buttons`);

  if (deleteButtons.length > 0) {
    console.log('Clicking first delete chapter button...');
    await deleteButtons[0].click();
    await page.waitForTimeout(1000);
  }

} catch (error) {
  console.error('Error:', error.message);
}

await browser.close();