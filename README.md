# Alexandria Library

Alexandria Library turns research papers into conversational listening experiences, guided by Pip, your wizard-cat librarian.

We are expected to learn at the speed of AI. Every day brings another paper, another breakthrough, another piece of documentation we are told to read to keep up.

But what happens when reading quickly is not how your mind works? For a dyslexic or neurodivergent learner, the distance between curiosity and comprehension can feel unnecessarily wide. Why should a wall of text be the one-size-fits-all gateway to discovery?

**Alexandria Library** is a listening library for curious minds who want another way in. It brings research into a welcoming bookshelf, with conversational podcasts, transcripts, visual stories and small questions to help ideas stick. The goal is to turn recent arXiv research into engaging audio so your inner scientist can stay connected to discoveries at a pace that works for you.

Pip, your wizard-cat librarian, guides you around the shelf, keeps you company as you listen, and offers questions to help you reflect on what you’ve learned. Your feedback helps the app adapt how it explains ideas. The longer-term vision includes helping you judge a paper’s credibility and relevance.


## How I used Codex

I built Alexandria Library with Codex as my coding partner. I shared the bookshelf idea, research papers, audio examples and visual references, then used Codex to inspect the material, build the app, test its interactions and refine the experience. Codex helped with the Astro interface, Pip’s guided tour, the audio player and transcript, local drafts and feedback, as well as the project’s architecture, documentation and GitHub workflow.

For Pip, I borrowed Codex’s **hatch-pet** skill and combined it with ImageGen to turn my wizard-cat reference into a character for the library. The workflow created and checked animation frames for actions such as idle, waving and running, and the app uses those ideas to bring Pip into the reading experience. The [artwork notes](public/art/README.md) describe the prompts and asset provenance; Pip is part of this website.

Codex also built the code behind the library’s research and audio workflows. The [refresh script](scripts/refresh.mjs) gathers arXiv metadata and research prompts; the [generation worker](scripts/worker.mjs) is designed to turn a selected source into a two-host script, audio, transcript, quiz and optional illustrations. These are app workflows created with Codex; new audio generation uses the configured cloud services described below.

One example I could check: I wanted listeners to answer three questions after an episode. Codex implemented the end-of-playback rule so seeking to the end opens the same quiz as listening through, added a test for the threshold, and checked the quiz and feedback in the browser.

## A look inside

The reading room and open-book view shown here are from the local development preview.

![The reading room bookshelf with Pip, the wizard-cat guide](docs/screenshots/bookshelf.jpg)

![An open research book with its audio conversation and Pip’s guidance](docs/screenshots/book-detail.jpg)

### Meet Pip, your guide

Select **Show me around** beside Pip to start a seven-step tour of the reading room. Pip points out the shelves and the listening experience, and you can move through the tour with **Next** or finish whenever you like. The tour pictured here is part of the current local development preview.

![Pip guiding a reader through the bookshelf](docs/screenshots/pip-tutorial.jpg)

### From research to conversation

Open a book to see its original paper alongside an audio conversation and timestamped transcript. The example below shows a supplied two-host recording playing with its transcript open; you can read along or follow the link to the paper. Creating a fresh episode uses the optional generation setup described below.

![A research paper alongside a playing podcast and timestamped transcript](docs/screenshots/podcast-transcript.jpg)

### Choose a paper and generate a podcast

Choose **Generate podcast** on a shelf to pick a recent paper and set the length of a two-host conversation. The generation screen below uses the current development preview; creating a new episode uses the connected generation services described in the setup guide.

![Podcast generation screen showing a choice of recent papers](docs/screenshots/generate-podcast.jpg)

### Check what you learned

At the end of an episode, Pip presents three questions based on its transcript. You can check your answers and share how difficult and useful the conversation felt.

![Pip’s end-of-episode quiz in the mobile book view](docs/screenshots/episode-quiz.jpg)

## How it works

```mermaid
flowchart LR
    Reader["Reader + Pip"] --> Library["Astro bookshelf<br/>audio · manga · quizzes"]
    Library --> Browser["Browser storage<br/>PDF drafts · feedback"]
    Library --> API["Astro API routes<br/>catalogue · jobs · feedback"]
    Arxiv["arXiv API"] --> Refresh["Scheduled refresh<br/>metadata + research prompts"]
    Refresh --> DB[("Supabase PostgreSQL<br/>papers · jobs · feedback")]
    API --> DB
    DB --> Worker["Durable Node worker<br/>script · audio · artwork"]
    Worker --> OpenAI["OpenAI API<br/>text · speech · images"]
    OpenAI --> Worker
    Worker --> Storage[("Supabase private storage<br/>audio · transcripts · artwork")]
    API --> Storage
    API --> Email["Resend<br/>requested email delivery"]
    Library --> Reader
```

The bookshelf brings together source papers, audio conversations, transcripts, conceptual manga and three-question quizzes. Browser storage keeps local PDF drafts and feedback on the device. The app’s Decision endpoint uses saved feedback to suggest an explanation style; scientific credibility assessment is part of the project vision. For fresh research and new episodes, configure the services below: arXiv supplies paper metadata, Supabase stores records and generated assets, and a durable worker coordinates OpenAI text, speech and optional illustration generation. Resend supports email requested by the reader.

## Try it on your computer

You’ll need [Node.js 24](https://nodejs.org/) and Git. Open a terminal and run:

```sh
git clone https://github.com/melaniepreen/alexandria-library.git
cd alexandria-library
npm ci
npm run dev
```

Open the local address printed in the terminal (normally [http://localhost:4321](http://localhost:4321)). Choose a book to explore its paper and transcript. Pip will help you find your way around; a three-question quiz follows each playable sample episode. Your PDF drafts and feedback stay in your browser.

The repository includes the sample book information, artwork and transcripts. The five original audio recordings are personal files, so to listen to those examples, use your copy of the audio archive:

```sh
python3 scripts/restore_audio.py "/path/to/your/Audio overviews-20261101T134113Z-1-001.zip"
```

Replace the path with the location of your ZIP file. Restart the app if it is already running. You can explore the bookshelf and transcripts without the ZIP. The included research catalogue is a dated snapshot; its links lead to the original papers.

To check the project, run `npm test` and `npm run build`.

## Create new episodes and send email

The bookshelf can be explored locally. Generating fresh podcasts, refreshing the catalogue automatically and sending email use optional cloud services and provider accounts. When you are ready to set those up, follow the [cloud setup guide](docs/CLOUD-SETUP.md). This also explains deployment on Vercel and the separate worker that creates episodes.
