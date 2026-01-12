// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@nuxtjs/supabase"],
    css: ["~/assets/css/main.css"],
    // @ts-ignore: supabase module types are not being picked up by the IDE
    supabase: {
        redirect: false,
    },
});
