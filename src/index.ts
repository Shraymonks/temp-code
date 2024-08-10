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
  auth: string;
  code: string;
}

const CODE_TTL_SECONDS = 60;

export default {
  async fetch(request, env): Promise<Response> {
    switch (request.method) {
      case 'PUT': {
        if (!request.body) {
          return new Response(null, { status: 400 });
        }
        const { auth, code } = await request.json<PutBody>();
        if (auth !== env.SECRET) {
          return new Response(null, { status: 403 });
        }
        await env.KV.put('code', code, {
          expirationTtl: CODE_TTL_SECONDS,
        });
        return new Response();
      }
      case 'GET': {
        const { searchParams } = new URL(request.url);
        if (searchParams.get('auth') !== env.SECRET) {
          return new Response(null, { status: 403 });
        }
        const code = await env.KV.get('code');
        const status = code == null ? 404 : 200;
        return new Response(code, { status });
      }
    }
    return new Response(null, { status: 400 });
  },
} satisfies ExportedHandler<Env>;
