import {defineConfig} from 'astro/config';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
const local=process.env.LOCAL_PREVIEW==='1';
export default defineConfig({output:'server',outDir:local?'./.local-build':'./dist',adapter:local?node({mode:'standalone'}):vercel()});
