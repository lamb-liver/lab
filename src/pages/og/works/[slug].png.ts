import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getStaticPathsFromCollection } from '../../../content/utils';
import { renderWorkOgPng } from '../../../lib/workOgImage';

export async function getStaticPaths() {
  const works = await getCollection('works');
  return getStaticPathsFromCollection(works).map(({ params }) => ({ params }));
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(null, { status: 404 });
  }

  try {
    const png = await renderWorkOgPng(slug);
    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
};
