import path from "path";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import { Users } from "./collections/Users";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Projects } from "./collections/Projects";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Comments } from "./collections/Comments";
import { Settings } from "./globals/Settings";
import { Footer } from "./globals/Footer";
import { Header } from "./globals/Header";
import nestedDocs from "@payloadcms/plugin-nested-docs";
import redirects from "@payloadcms/plugin-redirects";
import seo from "@payloadcms/plugin-seo";
import { GenerateTitle } from "@payloadcms/plugin-seo/dist/types";

const generateTitle: GenerateTitle = () => {
  return "My Website";
};

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    dateFormat: "yyyy/MMM/dd",
  },
  editor: slateEditor({ admin: { rtl: true } }),
  collections: [Pages, Posts, Projects, Media, Categories, Users, Comments],
  globals: [Settings, Header, Footer],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [
    redirects({
      collections: ["pages", "posts"],
    }),
    nestedDocs({
      collections: ["categories"],
    }),
    seo({
      collections: ["pages", "posts", "projects"],
      generateTitle,
      uploadsCollection: "media",
    }),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ""].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ""].filter(Boolean),
});
