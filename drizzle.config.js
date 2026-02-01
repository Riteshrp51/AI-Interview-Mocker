import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
    dbCredentials : {
        url : 'postgresql://neondb_owner:npg_UvQ18hmLKlPJ@ep-ancient-glade-a5xfuelv-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
    }
});
