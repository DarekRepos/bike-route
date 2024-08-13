import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site:'https://DarekRepos.github.io',
  base:'/bike-route',
  integrations: [tailwind(), react(), icon()]
});