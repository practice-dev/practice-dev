import { APIClient } from './APIClient';

const token = process.env.PD_ADMIN_TOKEN;
const url = process.env.PD_API_URL || 'http://localhost:3001';
if (!token) {
  throw new Error('PD_ADMIN_TOKEN is not set');
}

export const api = new APIClient(url, () => token);
