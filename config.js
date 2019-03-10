const dev = process.env.NODE_ENV !== 'production';

export const serverAddr = dev ? 'http://localhost:3000' : 'http://10.0.0.35';
