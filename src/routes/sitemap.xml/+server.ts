import type { RequestHandler } from './$types';

const siteUrl = 'https://timeflies.pages.dev/';

export const GET: RequestHandler = async () => {
	const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
		xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
		xmlns:xhtml="https://www.w3.org/1999/xhtml"
		xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
		xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
		xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
		xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
			<url>
				<loc>${siteUrl}</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
				<priority>1.0</priority>
			</url>
	  	</urlset>
		  `;
	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': `public, max-age=0, s-maxage=${60 * 60 * 24}`
		}
	});
};
