import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: process.env.SITE_URL || undefined, trailingSlash: 'always', vite: { plugins: [tailwindcss()] } });
