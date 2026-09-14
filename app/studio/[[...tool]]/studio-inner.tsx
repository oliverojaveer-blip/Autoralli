'use client'

import { Studio } from 'sanity'
import config from '@/sanity.config'

export function StudioInner() {
  return <Studio config={config} unstable_globalStyles />
}
