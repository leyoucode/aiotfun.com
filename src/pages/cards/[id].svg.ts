import type { APIRoute, GetStaticPaths } from 'astro';
import { renderCardSvg } from '../../lib/card-svg.ts';
import { projects, type Project } from '../../lib/projects.ts';

export const getStaticPaths: GetStaticPaths = () => projects.map((p) => ({ params: { id: p.id }, props: { p } }));

export const GET: APIRoute = ({ props }) => {
  const { p } = props as { p: Project };
  return new Response(renderCardSvg(p.id, p.ai), { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
};
