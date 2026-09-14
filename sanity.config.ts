import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { liveBlogSchemas } from './sanity/schemas/live-blog'
import { apiVersion, dataset, projectId } from './sanity/env'
import { anonymiseAuthorAction, deleteAuthorAction } from './sanity/actions/author-actions'

/**
 * Sanity Studio — toimetuse liides, mis elab saidi sees teel /studio
 * (app/studio/[[...tool]]/page.tsx). Sisse logivad ainult admin ja
 * toimetajad; kaasautorid postitavad Telegrami boti kaudu.
 */
export default defineConfig({
  name: 'autoralli',
  title: 'Autoralli.ee',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Sisu')
          .items([
            S.listItem()
              .title('Otseblogi')
              .child(
                S.list()
                  .title('Otseblogi')
                  .items([
                    S.listItem()
                      .title('Ootel postitused')
                      .child(
                        S.documentList()
                          .title('Ootel postitused')
                          .filter('_type == "livePost" && status == "draft"')
                          .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                      ),
                    S.documentTypeListItem('livePost').title('Kõik postitused'),
                    S.documentTypeListItem('eventContributor').title('Kaasautorid'),
                    S.documentTypeListItem('blogAuthor').title('Autorid'),
                  ]),
              ),
            S.documentTypeListItem('rallyEvent').title('Võistlused'),
          ]),
    }),
  ],
  schema: { types: liveBlogSchemas },
  document: {
    // Autoril on kaskaad-kustutamine ja GDPR-anonümiseerimine; vaikimisi
    // "Delete" jääks postituste viidete taha kinni.
    actions: (prev, { schemaType }) =>
      schemaType === 'blogAuthor' ? [...prev, anonymiseAuthorAction, deleteAuthorAction] : prev,
  },
  // Studio kasutab sama API versiooni, mis sait.
  apiVersion,
})
