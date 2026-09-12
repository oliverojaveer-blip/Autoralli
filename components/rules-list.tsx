import { ArrowSquareOut, FileDoc, FilePdf } from '@phosphor-icons/react/dist/ssr'
import type { RuleDocument } from '@/lib/rules-documents'

export function RulesList({ documents }: { documents: RuleDocument[] }) {
  return (
    <ul className="divide-y divide-line border-t border-line">
      {documents.map((doc) => (
        <li key={doc.href}>
          <a
            href={doc.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 py-5 transition-colors hover:bg-mist"
          >
            {doc.fileType === 'docx' ? (
              <FileDoc size={26} weight="duotone" className="shrink-0 text-blue" />
            ) : (
              <FilePdf size={26} weight="duotone" className="shrink-0 text-blue" />
            )}
            <span className="flex-1 text-base font-semibold text-black">{doc.label}</span>
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-slate sm:inline">
              {doc.fileType}
            </span>
            <ArrowSquareOut
              size={18}
              weight="bold"
              className="shrink-0 text-slate transition-colors group-hover:text-blue"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}
