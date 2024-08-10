// test/index.spec.ts
import { SELF, env } from 'cloudflare:test';
import { describe, it, expect, beforeEach } from 'vitest';

beforeEach(async () => {
  await env.KV.put('code', '111111');
});

describe('temp-code worker', () => {
  describe('GET', () => {
    it('responds 403 with no auth', async () => {
      const response = await SELF.fetch('https://example.com');
      expect(response.status).toBe(403);
      expect(await response.text()).toBe('');
      expect(await env.KV.get('code')).toBe('111111');
    });
    it('responds 403 with incorrect auth', async () => {
      const response = await SELF.fetch('https://example.com/?auth=wrong');
      expect(response.status).toBe(403);
      expect(await response.text()).toBe('');
      expect(await env.KV.get('code')).toBe('111111');
    });
    it('responds 404 if no code', async () => {
      await env.KV.delete('code');
      const response = await SELF.fetch('https://example.com/?auth=secret');
      expect(response.status).toBe(404);
      expect(await response.text()).toBe('');
      expect(await env.KV.get('code')).toBeNull();
    });
    it('responds 200 with correct auth', async () => {
      const response = await SELF.fetch('https://example.com/?auth=secret');
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('111111');
      expect(await env.KV.get('code')).toBe('111111');
    });
  });

  describe('PUT', () => {
    it('responds 400 with no body', async () => {
      const response = await SELF.fetch('https://example.com', {
        method: 'PUT',
      });
      expect(response.status).toBe(400);
      expect(await response.text()).toBe('');
      expect(await env.KV.get('code')).toBe('111111');
    });
    it('responds 403 with no auth', async () => {
      const response = await SELF.fetch('https://example.com', {
        body: JSON.stringify({ code: '123456' }),
        method: 'PUT',
      });
      expect(response.status).toBe(403);
      expect(await response.text()).toBe('');
      expect(await env.KV.get('code')).toBe('111111');
    });
    it('responds 403 with incorrect auth', async () => {
      const response = await SELF.fetch('https://example.com', {
        body: JSON.stringify({
          auth: 'wrong',
          code: '123456',
        }),
        method: 'PUT',
      });
      expect(response.status).toBe(403);
      expect(await response.text()).toBe('');
      expect(await env.KV.get('code')).toBe('111111');
    });
    it('responds 200 with correct auth', async () => {
      const response = await SELF.fetch('https://example.com', {
        body: JSON.stringify({
          auth: 'secret',
          code: '123456',
        }),
        method: 'PUT',
      });
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('');
      expect(await env.KV.get('code')).toBe('123456');
    });
  });

  it('responds 400 with unused methods', async () => {
    const response = await SELF.fetch('https://example.com', {
      method: 'POST',
    });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe('');
    expect(await env.KV.get('code')).toBe('111111');
  });
});
