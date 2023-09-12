import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Alexandria",
  description: "Documentation for Cyprus",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Server', link: '/server/specs-main' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Server',
        items: [
          { text: 'API Specification', link: '/server/specs-main' },
          { text: 'System Design', link: '/server/system-design' },
          {
            text: 'Subsystems',
            items: [
              { text: 'Transmission (WebSockets)', link: '/server/subsystems/transmission-websockets' },
              { text: 'Service Discovery', link: '/server/subsystems/service-discovery' },
              { text: 'Media Player', link: '/server/subsystems/media-player' }
            ]
          }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Apollo/cyprus' }
    ],
    footer: {
      copyright: 'Copyright (C) 2023 Goutham Krishna K V'
    }
  }
})
