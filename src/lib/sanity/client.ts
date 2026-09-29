import { env } from "@/config/env";

const API_VERSION = "2026-09-23";

export function isSanityConfigured(): boolean {
  return /^[a-z0-9-]+$/.test(env.sanityProjectId);
}

function apiUrl(path: string, cdn: boolean): string {
  const host = cdn ? "apicdn.sanity.io" : "api.sanity.io";
  return `https://${env.sanityProjectId}.${host}/v${API_VERSION}/data/${path}/${env.sanityDataset}`;
}

/**
 * Runs a GROQ query over Sanity's HTTP API. Server-only: the dataset is
 * private (it holds customers, orders and inquiries), so every read carries
 * the server token and nothing is ever queried from the browser.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  if (!isSanityConfigured()) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set.");
  }

  const search = new URLSearchParams({ query });
  for (const [key, value] of Object.entries(params)) {
    search.set(`$${key}`, JSON.stringify(value));
  }

  const token = serverToken();
  const response = await fetch(`${apiUrl("query", false)}?${search}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status}`);
  }

  const body = (await response.json()) as { result: T };
  return body.result;
}

/** The Editor token that reads and writes the private dataset. */
export function serverToken(): string | undefined {
  return process.env.SANITY_API_WRITE_TOKEN || undefined;
}

type Mutation =
  | { create: Record<string, unknown> }
  | { patch: { id: string; set: Record<string, unknown> } };

/** Applies mutations in one transaction. Server-only. */
export async function sanityMutate(mutations: Mutation[]): Promise<void> {
  const token = serverToken();
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is not set.");

  const response = await fetch(apiUrl("mutate", false), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    throw new Error(`Sanity mutation failed: ${response.status}`);
  }
}

/** Creates one document. Server-only: it needs a write token. */
export async function sanityCreate(
  document: Record<string, unknown>,
  token: string,
): Promise<void> {
  const response = await fetch(apiUrl("mutate", false), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations: [{ create: document }] }),
  });

  if (!response.ok) {
    throw new Error(`Sanity mutation failed: ${response.status}`);
  }
}

/**
 * Turns an image asset reference (image-<id>-<w>x<h>-<ext>) into its CDN URL.
 */
export function sanityImageUrl(ref: string | undefined | null): string | null {
  const match = ref?.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;
  const [, id, size, ext] = match;
  return `https://cdn.sanity.io/images/${env.sanityProjectId}/${env.sanityDataset}/${id}-${size}.${ext}?auto=format&w=1200`;
}
