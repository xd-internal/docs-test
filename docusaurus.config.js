// @ts-check
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'XplurData Docs',
  tagline: 'Unified Self-Hosted Observability Platform',
  favicon: 'img/favicon.ico',

  // GitHub Pages deployment
  // ⚠️ Update when moving from test → production:
  //   Production:  url: 'https://xplurdata.github.io',  baseUrl: '/docs/',         org: 'xplurdata',    project: 'docs'
  //   Test repo:   url: 'https://xd-internal.github.io', baseUrl: '/docs-test/',   org: 'xd-internal',  project: 'docs-test'
  url: 'https://xd-internal.github.io',
  baseUrl: '/docs-test/',

  organizationName: 'xd-internal',
  projectName: 'docs-test',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/xd-internal/docs-test/tree/main/',
          // Versioning — enable once v1.0 is tagged
          // lastVersion: 'current',
          // versions: {
          //   current: { label: 'v0.x (dev)', path: 'next' },
          // },
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/xplurdata-social-card.png',

      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      navbar: {
        title: 'XplurData',
        logo: {
          alt: 'XplurData Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          // Uncomment when versioning is enabled:
          // { type: 'docsVersionDropdown', position: 'right' },
          {
            href: 'https://xplurdata.com',
            label: 'Website',
            position: 'right',
          },
          {
            href: 'https://github.com/xplurdata/xplurdata',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Quick Start', to: '/docs/getting-started/quick-start' },
              { label: 'Architecture', to: '/docs/architecture/overview' },
              { label: 'API Reference', to: '/docs/api/overview' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'GitHub Issues', href: 'https://github.com/xplurdata/xplurdata/issues' },
              { label: 'GitHub Discussions', href: 'https://github.com/xplurdata/xplurdata/discussions' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'xplurdata.com', href: 'https://xplurdata.com' },
              { label: 'Apache 2.0 / MIT License', href: 'https://github.com/xplurdata/xplurdata/blob/main/LICENSE' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} XplurData. Built with Docusaurus.`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'yaml', 'docker', 'sql', 'json', 'python'],
      },

      // algolia: {
      //   Apply at https://docsearch.algolia.com/apply/ then fill in:
      //   appId: 'YOUR_APP_ID',
      //   apiKey: 'YOUR_SEARCH_API_KEY',
      //   indexName: 'xplurdata',
      // },
    }),
};

module.exports = config;
