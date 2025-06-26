// /pages/api/log-access.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { url, timestamp, userId } = req.body;
    console.log(`[MONITORING] ${userId} accessed ${url} at ${timestamp}`);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
