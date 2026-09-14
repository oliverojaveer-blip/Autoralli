import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

/**
 * Lugemisklient serverikomponentidele ja API-route'idele. `useCdn: true`
 * teenindab avaldatud sisu Sanity CDN-ist; mustandeid see ei näe (neid
 * pole avalikul lehel vaja). Kirjutamine käib eraldi tokeniga ainult
 * botist / Studiost, mitte siit.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})
