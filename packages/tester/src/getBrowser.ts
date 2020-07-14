import { launch } from './puppeteer';

export async function getBrowser() {
  return await launch({
    headless: process.env.SHOW_BROWSER !== 'true',
  });
}
