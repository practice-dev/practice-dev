import crypto from 'crypto';
import { Product } from './input-data';

const vendors = [
  'BESTRAM',
  'BESTRAM',
  'BESTRAM',
  'BESTRAM',
  'Rocket',
  'Rocket',
  'Xdata',
  '5Byte',
  'Abc',
  'gTech',
];

const capacities = [4, 4, 4, 4, 8, 8, 8, 16, 32];

const speeds = [2400, 2400, 2400, 2400, 2666, 3200, 3333, 3600, 4000];
const colors = ['Black', 'Black', 'Red', 'Green', 'Green', 'Green', 'White'];
const cycleLatencies = ['CL 7', 'CL 9', 'CL 11', 'CL 12'];

const data: Product[] = [];

function random<T>(array: T[]) {
  return array[crypto.randomBytes(4).readUInt32BE(0) % array.length];
}

const set = new Set();

while (data.length < 200) {
  const vendor = random(vendors);
  const capacity = random(capacities);
  const speed = random(speeds);
  const color = random(colors);
  const cycleLatency = random(cycleLatencies);

  const name = `${vendor} ${capacity}GB ${speed}MHz ${cycleLatency.replace(
    ' ',
    ''
  )} ${color === 'Green' ? '' : color}`.trim();
  if (!set.has(name)) {
    set.add(name);
    data.push({
      id: data.length + 1,
      name,
      vendor,
      capacity,
      speed,
      color,
      cycleLatency,
    });
  }
}

console.log(JSON.stringify(data, null, 2));
