import { NextResponse } from 'next/server';

export async function GET() {
  const logs = [
    {
      url: 'http://localhost:3000/',
      timestamp: new Date().toISOString(),
      userId: 'child-user-123',
    },
    {
      url: 'http://localhost:3000/control',
      timestamp: new Date().toISOString(),
      userId: 'child-user-123',
    },
  ];

  return NextResponse.json({ logs });
}
