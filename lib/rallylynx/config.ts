/**
 * ============================================================================
 *  RallyLynx — praeguse live-võistluse seadistus.
 * ============================================================================
 *  Live Center näitab alati ÜHTE hetkel käimasolevat/viimast võistlust.
 *  Uuele võistlusele üleminek = kahe keskkonnamuutuja vahetus .env.local's
 *  (või majutusteenuse seadetes) — koodi ei ole vaja puudutada:
 *
 *    RALLYLYNX_EVENT_ID=<uue võistluse event id>
 *    RALLYLYNX_API_KEY=<selle võistluse võti>
 *
 *  Kõik RallyLynx route'id/komponendid loevad seadistust siit, mitte otse
 *  `process.env`'ist, et see leping oleks ühes kohas dokumenteeritud ja
 *  jõustatud.
 * ============================================================================
 */

export type RallyLynxEventCredentials = {
  eventId: string
  apiKey: string
}

/**
 * Tagastab praeguse live-võistluse mandaadid või `null`, kui pole
 * seadistatud (nt kohalikus arenduses ilma .env.local'ita). Väljakutsuja
 * vastutab selle "seadistamata" oleku käsitlemise eest — see funktsioon
 * ei viska iial vaikimisi väljamõeldud andmeid.
 */
export function getCurrentRallyLynxEvent(): RallyLynxEventCredentials | null {
  const eventId = process.env.RALLYLYNX_EVENT_ID
  const apiKey = process.env.RALLYLYNX_API_KEY

  if (!eventId || !apiKey) return null

  return { eventId, apiKey }
}
