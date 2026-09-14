import { createHash } from 'node:crypto'

/**
 * ============================================================================
 *  Telegram Bot API õhuke klient (ilma sõltuvuseta, claude.md).
 * ============================================================================
 *  Token tuleb ainult keskkonnast; ükski funktsioon ei logi ega tagasta
 *  seda. Webhooki saladus tuletatakse tokenist (sha256), nii et eraldi
 *  keskkonnamuutujat pole vaja ja saladus vahetub koos tokeniga.
 */

const BASE = 'https://api.telegram.org'

export function botToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN puudub')
  return token
}

export function botConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN)
}

/** Telegram saadab selle päises X-Telegram-Bot-Api-Secret-Token; võrdleme iga päringu juures. */
export function webhookSecret(): string {
  return createHash('sha256').update(`webhook:${botToken()}`).digest('hex').slice(0, 48)
}

export type TgUser = { id: number; first_name: string; last_name?: string; username?: string }
export type TgChat = { id: number; type: 'private' | 'group' | 'supergroup' | 'channel' }
export type TgPhotoSize = { file_id: string; width: number; height: number; file_size?: number }
export type TgMessage = {
  message_id: number
  from?: TgUser
  chat: TgChat
  date: number
  text?: string
  caption?: string
  photo?: TgPhotoSize[]
  video?: { file_id: string; duration: number; width: number; height: number; file_size?: number; mime_type?: string }
  reply_to_message?: TgMessage
  entities?: Array<{ type: string; offset: number; length: number; url?: string }>
  caption_entities?: Array<{ type: string; offset: number; length: number; url?: string }>
}
export type TgCallbackQuery = { id: string; from: TgUser; message?: TgMessage; data?: string }
export type TgUpdate = { update_id: number; message?: TgMessage; callback_query?: TgCallbackQuery }

export type InlineKeyboard = Array<Array<{ text: string; callback_data?: string; url?: string }>>

async function call<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE}/bot${botToken()}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = (await res.json()) as { ok: boolean; result?: T; description?: string }
  if (!json.ok) throw new Error(`Telegram ${method}: ${json.description ?? res.status}`)
  return json.result as T
}

export function sendMessage(
  chatId: number,
  text: string,
  options: { keyboard?: InlineKeyboard; replyTo?: number; disablePreview?: boolean } = {},
): Promise<TgMessage> {
  return call<TgMessage>('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: options.keyboard ? { inline_keyboard: options.keyboard } : undefined,
    reply_parameters: options.replyTo ? { message_id: options.replyTo } : undefined,
    link_preview_options: { is_disabled: options.disablePreview ?? true },
  })
}

export function sendPhoto(chatId: number, fileId: string, caption: string, keyboard?: InlineKeyboard): Promise<TgMessage> {
  return call<TgMessage>('sendPhoto', {
    chat_id: chatId,
    photo: fileId,
    caption,
    parse_mode: 'HTML',
    reply_markup: keyboard ? { inline_keyboard: keyboard } : undefined,
  })
}

export function editMessageReplyMarkup(chatId: number, messageId: number, keyboard: InlineKeyboard | null): Promise<unknown> {
  return call('editMessageReplyMarkup', {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: keyboard ? { inline_keyboard: keyboard } : { inline_keyboard: [] },
  })
}

export function answerCallbackQuery(id: string, text?: string): Promise<unknown> {
  return call('answerCallbackQuery', { callback_query_id: id, text })
}

/** Laeb faili Telegramist alla (Bot API piir 20 MB). Tagastab baidid ja faililaiendi. */
export async function downloadFile(fileId: string): Promise<{ bytes: Buffer; extension: string }> {
  const file = await call<{ file_path?: string }>('getFile', { file_id: fileId })
  if (!file.file_path) throw new Error('Telegram getFile: file_path puudub')
  const res = await fetch(`${BASE}/file/bot${botToken()}/${file.file_path}`)
  if (!res.ok) throw new Error(`Telegram fail: ${res.status}`)
  const extension = file.file_path.split('.').pop() ?? 'bin'
  return { bytes: Buffer.from(await res.arrayBuffer()), extension }
}

export function setWebhook(url: string): Promise<unknown> {
  return call('setWebhook', {
    url,
    secret_token: webhookSecret(),
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true,
  })
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
