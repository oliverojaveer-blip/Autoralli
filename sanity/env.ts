/**
 * Sanity ühendusandmed. Projekti ID ja andmestik on avalikud väärtused
 * (need on igas päringu-URL-is), aga elavad .env.local/Verceli seadetes,
 * mitte koodis. Kui ID puudub (nt värske kloon), töötab sait edasi
 * näidisandmetega — vt lib/live-blog/adapter.ts.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = '2026-09-01'

export const sanityConfigured = projectId.length > 0
