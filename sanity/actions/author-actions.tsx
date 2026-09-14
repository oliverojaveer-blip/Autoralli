import { useState } from 'react'
import { useClient, type DocumentActionComponent, type DocumentActionProps } from 'sanity'
import { apiVersion } from '../env'

/**
 * ============================================================================
 *  Autori dokumendi toimingud Studios.
 * ============================================================================
 *  Sanity vaikimisi "Delete" keeldub, kui autorile viitavad postitused või
 *  kaasautori kirjed. Moderaatoril peab see võim olema — seega kaks
 *  toimingut, mis teevad selle õiges järjekorras ise:
 *
 *  - Kustuta autor ja kõik tema postitused: postitused → kaasautori kirjed
 *    (ka mustandid) → autor. Jäädav.
 *  - Anonümiseeri (GDPR): postitused peidetakse, kirjed deaktiveeritakse,
 *    autori nimi/ID kustutatakse, aga dokumendid jäävad alles (arhiivi
 *    jälg). Sama, mida bot teeb "kustuta mind" peale.
 * ============================================================================
 */

async function referencing(client: ReturnType<typeof useClient>, authorId: string) {
  const ids = [authorId, `drafts.${authorId}`]
  return client.fetch<{ posts: string[]; contributors: string[] }>(
    `{
      "posts": *[_type == "livePost" && author._ref in $ids]._id,
      "contributors": *[_type == "eventContributor" && author._ref in $ids]._id
    }`,
    { ids },
  )
}

export const deleteAuthorAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const client = useClient({ apiVersion })
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const name = (props.published ?? props.draft)?.displayName as string | undefined

  return {
    label: 'Kustuta autor ja postitused',
    tone: 'critical',
    disabled: busy,
    onHandle: async () => {
      const refs = await referencing(client, props.id)
      setSummary(`${refs.posts.length} postitust ja ${refs.contributors.length} kaasautori kirjet`)
      setConfirm(true)
    },
    dialog: confirm && {
      type: 'confirm',
      tone: 'critical',
      message: `Kustutada „${name ?? props.id}“ jäädavalt koos kõigega (${summary})? Seda ei saa tagasi võtta. Kui inimene palus ainult andmete kustutamist, kasuta „Anonümiseeri“.`,
      onCancel: () => setConfirm(false),
      onConfirm: async () => {
        setBusy(true)
        try {
          const refs = await referencing(client, props.id)
          const tx = client.transaction()
          for (const id of refs.posts) tx.delete(id).delete(`drafts.${id}`)
          for (const id of refs.contributors) tx.delete(id).delete(`drafts.${id}`)
          tx.delete(props.id).delete(`drafts.${props.id}`)
          await tx.commit()
          props.onComplete()
        } finally {
          setBusy(false)
          setConfirm(false)
        }
      },
    },
  }
}

export const anonymiseAuthorAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const client = useClient({ apiVersion })
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const name = (props.published ?? props.draft)?.displayName as string | undefined

  return {
    label: 'Anonümiseeri (GDPR)',
    tone: 'caution',
    disabled: busy,
    onHandle: () => setConfirm(true),
    dialog: confirm && {
      type: 'confirm',
      tone: 'caution',
      message: `Peita „${name ?? props.id}“ postitused, deaktiveerida kaasautori kirjed ja eemaldada nimi, konto ja Telegrami ID? Dokumendid jäävad alles, isikuandmed mitte.`,
      onCancel: () => setConfirm(false),
      onConfirm: async () => {
        setBusy(true)
        try {
          const refs = await referencing(client, props.id)
          const tx = client.transaction()
          for (const id of refs.posts) tx.patch(id, (p) => p.set({ status: 'hidden' }))
          for (const id of refs.contributors) tx.patch(id, (p) => p.set({ active: false }))
          tx.patch(props.id, (p) =>
            p
              .set({
                displayName: 'Kustutatud kaasautor',
                telegramId: `erased-${props.id}`,
                telegramUsername: null,
                contactEmail: null,
              })
              .unset(['handle', 'avatar']),
          )
          await tx.commit()
          props.onComplete()
        } finally {
          setBusy(false)
          setConfirm(false)
        }
      },
    },
  }
}
