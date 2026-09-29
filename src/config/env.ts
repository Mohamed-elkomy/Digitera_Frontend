/**
 * Public environment configuration.
 * Do not store secrets in NEXT_PUBLIC_* variables — they are exposed to the browser.
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "",
  /** In-repo mock data is the default, so the site runs with no setup at all. */
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API !== "false",
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "",
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
};
