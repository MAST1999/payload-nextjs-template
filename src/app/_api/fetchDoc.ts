import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

import type { Config } from "../../payload/payload-types";
import { PAGE, PAGE_ID } from "../_graphql/pages";
import { POST } from "../_graphql/posts";
import { PROJECT } from "../_graphql/projects";
import { GRAPHQL_API_URL } from "./shared";
import { payloadToken } from "./token";

const queryMap = {
  pages: {
    query: PAGE,
    key: "Pages",
  },
  pagesId: {
    query: PAGE_ID,
    key: "PagesId",
  },
  posts: {
    query: POST,
    key: "Posts",
  },
  projects: {
    query: PROJECT,
    key: "Projects",
  },
};

export const fetchDoc = async <T,>(args: {
  collection: keyof Config["collections"];
  slug?: string;
  id?: number;
  draft?: boolean;
}): Promise<T> => {
  const { collection, slug, draft, id } = args || {};

  if (!queryMap[collection]) throw new Error(`Collection ${collection} not found`);

  let token: RequestCookie | undefined;

  if (draft) {
    const { cookies } = await import("next/headers");
    token = cookies().get(payloadToken);
  }

  const doc: T = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
    },
    cache: "no-store",
    next: { tags: [`${collection}_${slug}`] },
    body: JSON.stringify({
      query: queryMap[collection].query,
      variables: {
        slug,
        draft,
        id,
      },
    }),
  })
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? "Error fetching doc");
      return res?.data?.[queryMap[collection].key]?.docs?.[0];
    });

  return doc;
};
