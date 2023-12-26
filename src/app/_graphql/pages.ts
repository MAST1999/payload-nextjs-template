import { gql } from "../utilities/gql";
import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, MEDIA_BLOCK } from "./blocks";
import { LINK_FIELDS } from "./link";
import { MEDIA } from "./media";
import { META } from "./meta";

export const PAGES = gql`
  query Pages {
    Pages(limit: 300) {
      docs {
        slug
      }
    }
  }
`;

export const PAGE = gql`
  query Page($slug: String, $draft: Boolean) {
    Pages(where: { slug: { equals: $slug }}, limit: 1, draft: $draft) {
      docs {
        id
        title
        hero {
          type
          richText
          links {
            link ${LINK_FIELDS()}
          }
          ${MEDIA}
        }
        layout {
          ${CONTENT}
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        ${META}
      }
    }
  }
`;

export const PAGE_ID = gql`
  query Page($id: String, $draft: Boolean) {
    Pages(where: { id: { equals: $id }}, limit: 1, draft: $draft) {
      docs {
        id
        title
        hero {
          type
          richText
          links {
            link ${LINK_FIELDS()}
          }
          ${MEDIA}
        }
        layout {
          ${CONTENT}
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        ${META}
      }
    }
  }
`;
