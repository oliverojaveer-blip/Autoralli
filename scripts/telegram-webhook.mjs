/**
 * Registreerib Telegrami webhooki. Käivita pärast deploy'd:
 *
 *   node scripts/telegram-webhook.mjs https://<sinu-domeen>
 *
 * Loeb TELEGRAM_BOT_TOKEN .env.local failist; saladus tuletatakse
 * tokenist samamoodi nagu lib/telegram/api.ts (sha256). Ilma argumendita
 * näitab praegust webhooki seisu.
 */
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => l.split('=').map((s) => s.trim()))
    .map(([k, ...v]) => [k, v.join('=')]),
)
const token = env.TELEGRAM_BOT_TOKEN
if (!token) throw new Error('TELEGRAM_BOT_TOKEN puudub .env.local failis')
const secret = createHash('sha256').update(`webhook:${token}`).digest('hex').slice(0, 48)
const api = (method, body) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  }).then((r) => r.json())

const origin = process.argv[2]
if (!origin) {
  const info = await api('getWebhookInfo')
  console.log(JSON.stringify(info.result, null, 2))
} else {
  const url = `${origin.replace(/\/$/, '')}/api/telegram/webhook`
  const res = await api('setWebhook', {
    url,
    secret_token: secret,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true,
  })
  console.log(res.ok ? `Webhook registreeritud: ${url}` : `Viga: ${res.description}`)
  const me = await api('getMe')
  console.log(`Bot: @${me.result?.username}`)
}
