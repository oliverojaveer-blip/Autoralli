import { notFound } from 'next/navigation'

/** Tundmatud teed `[locale]` all -> meie enda not-found leht, mitte Next'i vaikimisi. */
export default function CatchAll() {
  notFound()
}
