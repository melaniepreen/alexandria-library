# Cloud setup for Alexandria Library

This optional guide is for deploying the app and configuring fresh generation and email delivery. To try the bookshelf on your computer first, start with the [README](../README.md#try-it-on-your-computer).

## Configure generation and delivery

The cloud setup uses Vercel for the Astro application, Supabase for PostgreSQL and private object storage, a durable Node worker, OpenAI for generation, and Resend for requested emails. Configure only the services you plan to use.

1. Create a Supabase project and run [`supabase.sql`](../supabase.sql) in a fresh database. The application tables use row-level security, and the `episodes` storage bucket is private.
2. Copy [`.env.example`](../.env.example) to `.env` and set the server-side Supabase and OpenAI values. Generate independent long random values for `OWNER_TOKEN` and `CRON_SECRET`, and set `SITE_URL` to your application URL. Keep `.env` private.
3. Run `npm run seed` to add the five sample paper records. Run `npm run refresh` to retrieve recent finance and quantum metadata and create abstract-grounded finance research prompts when an OpenAI key is configured.
4. Run `npm run worker` on a durable Node host with a process supervisor or scheduler. Each invocation claims one queued job, creates a source-grounded conversational script and AI-voiced audio, validates its duration, and stores the resulting assets. Job status is visible in the app. Set provider spending limits appropriate for your project.
5. Set `IMAGE_MODEL` to an available Images API model, such as `gpt-image-2.5-sunburst`, to generate transcript-grounded cover and comic illustrations. The sample artwork provides a visual starting point.
6. To enable requested email, set `RESEND_API_KEY` and `EMAIL_FROM` using a verified sender or domain. Enter the `OWNER_TOKEN` through the app’s settings to access owner-only cloud actions.

For full-paper generation, paste extracted paper text into **Add a paper**. Generation uses the supplied source text or the arXiv abstract and labels the source scope. The worker validates source references, quiz evidence and audio duration; readers should evaluate the original paper and its scientific claims themselves.

The refresh process uses a three-hour cache and lock, deduplicates arXiv versions, and spaces API requests. An existing worker host can schedule `npm run refresh` every three hours. For Vercel cron, consult the [plan limits](https://vercel.com/docs/cron-jobs/usage-and-pricing) and the optional [`vercel.pro-cron.example.json`](../vercel.pro-cron.example.json). Review current [OpenAI pricing](https://developers.openai.com/api/docs/pricing) and your storage, hosting and email costs before enabling paid services.

## Deploy

The project includes an Astro Vercel adapter. Import [the GitHub repository](https://github.com/melaniepreen/alexandria-library) into Vercel, select Node 24, use `npm ci` to install and `npm run build` to build, and add the server environment variables for your selected services. The durable worker runs separately on a Node host. The [project summary](../PROJECT.md) describes the audience, today’s build and a concrete example of Codex in the workflow.
