import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getStaticPathsFromCollection } from '../../../content/utils';
import { preloadWorkOgFonts, renderWorkOgPng } from '../../../lib/workOgImage';

export async function getStaticPaths() {
  const works = await getCollection('works');
  preloadWorkOgFonts();
  return getStaticPathsFromCollection(works).map(({ params, props }) => ({
    params,
    props: { title: props.entry.data.title },
  }));
}

export const GET: APIRoute = async ({ params, props }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(null, { status: 404 });
  }

  try {
    const png = await renderWorkOgPng(slug, props.title);
    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`[og/works/${slug}.png]`, error);
    }
    return new Response(null, { status: 404 });
  }
};
