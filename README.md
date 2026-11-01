# The Paper Familiar

We are expected to learn at the speed of AI. Every day brings another paper, another breakthrough, another piece of documentation we are told to read to keep up.

But what happens when reading quickly is not how your mind works? For a dyslexic or neurodivergent learner, the distance between curiosity and comprehension can feel unnecessarily wide. Why should a wall of text be the one-size-fits-all gateway to discovery?

**The Paper Familiar** is a listening library for curious minds who want another way in. It brings research into a welcoming bookshelf, with conversational podcasts, transcripts, visual stories and small questions to help ideas stick. Its goal is to turn recent arXiv research into engaging audio so your inner scientist can stay connected to new papers and discoveries at a pace that works for you.

The vision is to help you judge whether a paper is credible and relevant to you. Today, the app’s own Decision endpoint adapts explanation style using your feedback; it does **not** yet assess scientific credibility. Recent-paper refresh and new podcast generation require the cloud services described below.


## Run

Use Node 24 (Vercel's supported runtime). The implementation was built and tested locally with Node 26; the Vercel adapter selected Node 24.

```sh
npm ci --cache /tmp/paper-familiar-npm-cache
npm run dev
npm test
npm run build
```

Open http://localhost:4321. No cloud key is needed to explore the bookshelf, transcripts, quizzes, local PDF drafts or local feedback. The public repository omits the owner's supplied MP3 files, PDFs and reference screenshots. To enable the five recordings, restore them from your own copy of the original audio archive:

```sh
python3 scripts/restore_audio.py "/path/to/Audio overviews-20261101T134113Z-1-001.zip"
```

Without those files, the visual library and transcripts work, but sample audio playback is unavailable. Seeking to the last half-second opens the same three-question quiz as normal completion. Automatic transcripts were produced locally with faster-whisper tiny.en; technical terms, speaker attribution and podcast claims are not fully fact-checked. Paper titles and subjects were correlated against the transcript and real arXiv API metadata. These five supplied recordings are not newly generated podcasts. They last 7:52–10:52. Source metadata and quiz evidence live in `public/data`.

The five finance/quantum examples are arXiv 2109.13851, 2112.06753, 2605.21192, 2404.14115 and 2606.20123. They are archival examples, not the latest five papers. New arrivals uses a dated real arXiv snapshot until cloud refresh is configured. The snapshot was retrieved on 1 November 2026; latest submitted finance records are dated 29 October, and arXiv's new-listings page is dated 30 October. Polling frequency does not change arXiv's publication schedule.

Each shelf has its own **Generate finance podcast** or **Generate quantum podcast** button. Choose from that shelf’s latest five arXiv papers, set a 5–25 minute duration, and explicitly queue a two-host episode. The dated snapshot works before setup; producing audio requires the cloud services below. Use the dialog’s librarian key/setup link and generation jobs button to follow the durable job. No provider API keys are entered in the browser.

## Connect cloud features

Minimal stack: Vercel for Astro/API routes, one Supabase project for PostgreSQL job state/private object storage, a durable Node worker on an existing machine or worker host, OpenAI for structured scripts/audio and optional art, and Resend for explicitly requested email. Nothing has been purchased or provisioned.

1. Create/select a Supabase project; run `supabase.sql` once in a fresh database. All application tables have RLS enabled and no client policies. Only the server service role can access them. The `episodes` bucket is private.
2. Copy `.env.example` to `.env` and fill secrets on the server. Use independently generated long random `OWNER_TOKEN` and `CRON_SECRET` values. Never use a public-prefixed environment variable for a secret. Set `SITE_URL` to your eventual HTTPS URL. Keep `.env` out of Git.
3. Set the documented Responses model (`TEXT_MODEL`, default `gpt-4.1-mini`) and OpenAI API key. Audio uses `/v1/audio/speech`, `gpt-4o-mini-tts`, two distinct voices (`coral` and `onyx`), and PCM output. The worker constructs a valid 24 kHz mono WAV and validates actual duration before completion. There is no browser speech synthesis.
4. `npm run seed` inserts the five sample paper records so those books can request fresh episodes. `npm run refresh` fetches newest finance and quantum metadata, deduplicates versions and writes five abstract-grounded finance research prompts when the OpenAI key is present.
5. Run `npm run worker` on a durable Node host, repeatedly (for example a process supervisor invoking it once per minute). Each invocation atomically claims one persisted job, does the long work outside Vercel, then exits. Concurrent workers use `FOR UPDATE SKIP LOCKED`. A 60-minute lease recovers interrupted jobs, with two total attempts. A 45-minute worker timeout bounds a run. Provider failures become visible failed jobs; no completion is fabricated. Failed jobs can be queued again explicitly. Set provider budget limits: retries can incur additional charges.
6. For new transcript-grounded covers and three-panel comics, set `IMAGE_MODEL=gpt-image-2.5-sunburst` (or a currently supported Images API model you have enabled). Two image jobs run in the durable worker after audio. Illustration failure preserves ready audio and exposes an art warning. Without `IMAGE_MODEL`, original conceptual artwork is used and the missing art configuration is disclosed.
7. Set `RESEND_API_KEY` and `EMAIL_FROM` using a verified Resend sender/domain. The app sends a source/library link only after explicit form submission. It validates the email, requires the owner bearer key, and applies an atomic shared 40-request/hour cloud limit. A provider receipt triggers the cat's delivery animation. A receipt means provider acceptance, not guaranteed inbox arrival. No test email has been sent.
8. Enter `OWNER_TOKEN` through the gear button. It stays in page memory for the current visit, not localStorage. Ready jobs return one-hour signed asset links and open in the same listening/quiz view. Refresh the jobs list to renew expired links.

Audio generation starts with the arXiv abstract (scope disclosed), or your explicitly uploaded extracted paper text. The app never claims to have read a full paper when it only has the abstract. PDFs can be retained/read/deleted in browser IndexedDB; automatic PDF extraction is not connected. To generate from a full PDF, paste its extracted text in Add a paper. That separate submit explicitly uploads text to private storage and the generation provider. The public catalogue excludes uploaded sources.

Scripts validate host names, structured JSON, source IDs, exact source-evidence substrings, three transcript-grounded quiz evidence strings, target word count, and actual 5–25-minute audio duration. This validates structure and attribution, not the scientific truth of every generated sentence. Finance briefs distinguish hypotheses, assumptions and falsifiable tests. No trades are executed and no profit is asserted.

`GET /api/decision` is this app's documented recommendation endpoint; it does not assume an external product called Decision API. It returns a difficulty-adjusted explanation style plus positively/negatively rated paper IDs from recent saved usefulness feedback. Local feedback adapts the guide immediately; cloud feedback informs new scripts. This is a single-owner app, not a multi-user account system.

## Three-hour refresh and costs

The refresh has a three-hour cache and a database lock. Two sequential arXiv requests are spaced by at least 3.1 seconds; IDs are canonicalized to deduplicate versions. Failed requests retain the previous catalogue. arXiv API terms require polite access: https://info.arxiv.org/help/api/tou.html.

Vercel Hobby cron is limited to once a day; a three-hour cron expression will fail deployment on Hobby. See https://vercel.com/docs/cron-jobs/usage-and-pricing. The base `vercel.json` intentionally contains no cron, so the app can deploy on Hobby. If you already have a suitable paid Vercel plan, merge the example in `vercel.pro-cron.example.json`. Otherwise have your existing worker host call `npm run refresh` every three hours. HTTP refresh requires `Authorization: Bearer <CRON_SECRET>` at `/api/refresh`. Do not put the secret in a URL.

Budget assumptions, not a quote: Vercel lists Hobby at $0 and Pro at $20/month; Supabase lists Free at $0 with 1 GB file storage/5 GB egress and Pro from $25/month. Hosting the worker on an existing machine avoids a new worker subscription but requires it to remain available. A 10-minute uncompressed WAV is about 28.8 MB, so 30 such episodes use about 864 MB before images. Lifecycle deletion/compression will be needed beyond a small prototype.

For planning only, reserve $0.02 per generated audio minute plus text, images, retries, storage and egress: five 10-minute episodes would reserve $1 for audio. At five episodes daily, that is $30/month of audio budget plus other usage. This is a conservative budgeting assumption, not a verified current TTS tariff. Actual charges depend on model/token usage. Check current official pricing before enabling billing: https://developers.openai.com/api/docs/pricing. Image output/token costs and model parameters: https://developers.openai.com/api/docs/guides/image-generation. No episodes are automatically synthesized every three hours; only metadata and short research prompts refresh.

## Publish

The app has an Astro Vercel adapter and builds into `.vercel/output`. Import this GitHub repository into Vercel with this directory as the root, install with `npm ci`, and build with `npm run build`; add the server environment variables in the Vercel dashboard. Use Node 24. A custom domain is optional.

Public source repository: https://github.com/melaniepreen/paper-familiar. No deployed app URL has been verified. The development URL above runs only on your own computer. See [PROJECT.md](PROJECT.md) for the project submission summary and what was built on 1 November 2026.

The app has not been connected to live provider credentials in this checkout. Deployment is a separate step; this repository publication does not create a hosted app.

## Verification and limits

`npm test`: ten tests for duration validation, seeking completion, adaptive feedback, arXiv parsing/deduplication, and all five sample audio/transcript/quiz correlations. `npm run build`: passes. `npm audit --omit=dev`: zero reported vulnerabilities after compatible dependency overrides. Overrides are recorded in package.json and should be reviewed with future adapter updates.

Browser QA verified real audio load/playback, seeking to end, three correct quiz answers with transcript evidence, and local feedback persistence/adaptation, plus desktop/mobile layouts. Credentials were unavailable for live provider, database, email, worker integration or hosting tests. No email was sent and no new paid service was created. Cover/comic generation for new jobs requires provider setup; sample art is conceptual and source claims must be checked against the originals.

The optional expanded Pip sprite atlas is not included yet; the existing four-pose strip remains the fallback. The build currently warns about that optional asset.

Art references, final prompts and built-in imagegen provenance are in `public/art/README.md`. The supplied brown/cream, purple/gold wizard cat reference was used for the final four-pose transparent strip. This is a web app sprite, not a ChatGPT/Codex pet activation.
