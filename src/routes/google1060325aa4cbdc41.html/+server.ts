import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response('google-site-verification: google1060325aa4cbdc41.html');
};
