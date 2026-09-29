/**
 * The Sanity project this dashboard edits. Set it once in dashboard/.env:
 *
 *   SANITY_STUDIO_PROJECT_ID=abc123de
 *
 * (the same id the website reads from NEXT_PUBLIC_SANITY_PROJECT_ID).
 */
export const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id'
export const DATASET = process.env.SANITY_STUDIO_DATASET || 'production'
