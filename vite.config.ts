// Clean up tsx-injected global __dirname if it is relative to prevent vite-plugin-pwa crash
if ((globalThis as any).__dirname === '.') {
  delete (globalThis as any).__dirname;
}

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'vite-suppress-hmr-preview-error',
        transformIndexHtml: {
          order: 'pre',
          handler() {
            return [
              {
                tag: 'script',
                attrs: { type: 'text/javascript' },
                children: `
(function() {
  var origError = console.error;
  console.error = function() {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      var s = typeof arg === 'string' ? arg : (arg && (arg.message || arg.stack) ? arg.message + ' ' + arg.stack : String(arg));
      if (s && (s.indexOf('[vite]') !== -1 || s.indexOf('WebSocket') !== -1 || s.indexOf('websocket') !== -1)) {
        return;
      }
    }
    return origError.apply(console, arguments);
  };

  var origWarn = console.warn;
  console.warn = function() {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      var s = typeof arg === 'string' ? arg : (arg && (arg.message || arg.stack) ? arg.message + ' ' + arg.stack : String(arg));
      if (s && (s.indexOf('[vite]') !== -1 || s.indexOf('WebSocket') !== -1 || s.indexOf('websocket') !== -1)) {
        return;
      }
    }
    return origWarn.apply(console, arguments);
  };

  var OrigWebSocket = window.WebSocket;
  if (typeof OrigWebSocket !== 'undefined') {
    window.WebSocket = function(url, protocols) {
      var isVite = false;
      var strUrl = String(url || '');
      if (
        protocols === 'vite-hmr' ||
        protocols === 'vite-ping' ||
        strUrl.indexOf('token=') !== -1 ||
        strUrl.indexOf('24678') !== -1 ||
        strUrl.indexOf('5173') !== -1
      ) {
        isVite = true;
      }
      if (!isVite && Array.isArray(protocols)) {
        isVite = protocols.indexOf('vite-hmr') !== -1 || protocols.indexOf('vite-ping') !== -1;
      }

      if (isVite) {
        var target = new EventTarget();
        target.url = url;
        target.protocols = protocols;
        target.readyState = 1;
        target.bufferedAmount = 0;
        target.extensions = '';
        target.protocol = typeof protocols === 'string' ? protocols : '';
        target.binaryType = 'blob';
        target.send = function() {};
        target.close = function(code, reason) {
          target.readyState = 3;
          if (typeof target.onclose === 'function') {
            target.onclose({ type: 'close', code: code || 1000, reason: reason || '', wasClean: true });
          }
        };

        target.onopen = null;
        target.onmessage = null;
        target.onerror = null;
        target.onclose = null;

        setTimeout(function() {
          if (target.readyState === 1) {
            var openEvent = new Event('open');
            if (typeof target.onopen === 'function') {
              try { target.onopen(openEvent); } catch(e) {}
            }
            target.dispatchEvent(openEvent);
          }
        }, 10);

        return target;
      }

      return new OrigWebSocket(url, protocols);
    };

    window.WebSocket.CONNECTING = 0;
    window.WebSocket.OPEN = 1;
    window.WebSocket.CLOSING = 2;
    window.WebSocket.CLOSED = 3;
    window.WebSocket.prototype = OrigWebSocket.prototype;
  }

  window.addEventListener('error', function(e) {
    var msg = (e && e.message) ? String(e.message) : '';
    var fn = (e && e.filename) ? String(e.filename) : '';
    if (msg.indexOf('[vite]') !== -1 || msg.indexOf('WebSocket') !== -1 || fn.indexOf('vite') !== -1) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', function(e) {
    var reason = (e && e.reason) ? String(e.reason.message || e.reason) : '';
    if (reason.indexOf('[vite]') !== -1 || reason.indexOf('WebSocket') !== -1) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
})();
`,
                injectTo: 'head-prepend',
              },
            ];
          },
        },
      },
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'DocSure AI',
          short_name: 'DocSure',
          description: 'Document Screening Studio',
          theme_color: '#063F3A',
          background_color: '#F8F5ED',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
