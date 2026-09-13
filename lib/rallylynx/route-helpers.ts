import { NextResponse } from 'next/server'
import { RallyLynxError } from './client'
import { getCurrentRallyLynxEvent, type RallyLynxEventCredentials } from './config'

/**
 * Ühine Route Handler'ite ümbris: toob praeguse võistluse mandaadid,
 * käivitab adapteri funktsiooni ja teisendab vead HTTP vastusteks.
 * Väldib sama try/catch + 503-kontrolli kordamist igas RallyLynx route'is.
 */
export async function handleRallyLynxRequest<T>(
  loader: (credentials: RallyLynxEventCredentials) => Promise<T>,
  responseInit?: ResponseInit,
): Promise<NextResponse> {
  const credentials = getCurrentRallyLynxEvent()

  if (!credentials) {
    return NextResponse.json(
      { error: 'RallyLynx ei ole seadistatud (RALLYLYNX_EVENT_ID / RALLYLYNX_API_KEY puuduvad).' },
      { status: 503 },
    )
  }

  try {
    const data = await loader(credentials)
    return NextResponse.json(data, responseInit)
  } catch (error) {
    if (error instanceof RallyLynxError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'RallyLynx päring ebaõnnestus.' }, { status: 502 })
  }
}
