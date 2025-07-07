/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

interface PutBody {
  code: string;
}

const CODE_TTL_SECONDS = 60;

export default {
  async fetch(request, env): Promise<Response> {
    if (request.headers.get('Authorization') !== env.SECRET) {
      return new Response(null, { status: 403 });
    }
    switch (request.method) {
      case 'PUT': {
        try {
          if (!request.body) {
            return new Response(null, { status: 400 });
          }
          const { code } = await request.json<PutBody>();
          await env.KV.put('code', code, {
            expirationTtl: CODE_TTL_SECONDS,
          });
          return new Response();
        } catch (e) {
          return new Response(null, { status: 400 });
        }
      }
      case 'GET': {
        const code = await env.KV.get('code');
        const status = code == null ? 404 : 200;
        return new Response(code, { status });
      }
    }
    return new Response(null, { status: 400 });
  },
} satisfies ExportedHandler<Env>;
