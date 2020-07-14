import { Browser } from 'puppeteer';

const chromium = process.env.IS_AWS ? require('chrome-aws-lambda') : null;
const puppeteer = process.env.IS_AWS
  ? require('puppeteer-core')
  : require('puppeteer');

export function connect(options: any): Browser {
  return puppeteer.connect(options);
}

export async function launch({ headless }: { headless: boolean }) {
  return (await puppeteer.launch(
    process.env.IS_AWS
      ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath,
          headless,
        }
      : {
          args: [
            '--disable-extensions',
            '--disable-infobars',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-offer-upload-credit-cards',
            '--enable-async-dns',
            '--enable-simple-cache-backend',
            '--enable-tcp-fast-open',
            '--password-store=basic',
            '--disable-translate',
            '--disable-cloud-import',
            '--no-first-run',
            '--start-maximized',
          ],
          headless,
          devtools: !headless,
          defaultViewport: null,
        }
  )) as Browser;
}
