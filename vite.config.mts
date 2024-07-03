// Plugins
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import Vue from '@vitejs/plugin-vue'

// Utilities
import checker from 'vite-plugin-checker';
import dns from 'dns';

import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ViteEjsPlugin((config) => ({
      NODE_ENV: config.mode,
      isPrd: config.mode === 'production',
      isLocal: config.mode === 'development'
    })),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true
    }),
    checker({
      typescript: true,
      vueTsc: true,
      eslint: {
        lintCommand: 'eslint src --ext vue,ts'
      }
    })
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 8080,
  },
})
