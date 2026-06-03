import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getStaticPathsFromCollection } from '../../../content/utils';
import { getCurveThumbnailSvg } from '../../../lib/curveThumbnail';

export async function getStaticPaths() {
  const works = await getCollection('works');
  return getStaticPathsFromCollection(works).map(({ params }) => ({ params }));
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(null, { status: 404 });
  }

  const svg = getCurveThumbnailSvg(slug);
  if (!svg) {
    return new Response(null, { status: 404 });
  }

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
