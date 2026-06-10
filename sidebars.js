/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/configuration',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Architecture',
      items: [
        'architecture/overview',
        'architecture/data-flow',
        'architecture/components',
      ],
    },
    {
      type: 'category',
      label: '📡 Collectors',
      items: [
        'collectors/otel-agent',
        'collectors/metrics',
        'collectors/logs',
        'collectors/traces',
      ],
    },
    {
      type: 'category',
      label: '🗄️ Storage',
      items: [
        'storage/apache-doris',
        'storage/iceberg',
        'storage/schema',
        'storage/retention',
      ],
    },
    {
      type: 'category',
      label: '📊 Visualization',
      items: [
        'visualization/grafana',
        'visualization/dashboards',
        'visualization/alerts',
      ],
    },
    {
      type: 'category',
      label: '🔌 API Reference',
      items: [
        'api/overview',
        'api/authentication',
        'api/endpoints',
      ],
    },
    {
      type: 'category',
      label: '🐳 Deployment',
      items: [
        'deployment/docker-compose',
        'deployment/production',
        'deployment/upgrades',
      ],
    },
    {
      type: 'category',
      label: '🔧 Troubleshooting',
      items: [
        'troubleshooting/common-issues',
        'troubleshooting/logs',
        'troubleshooting/faq',
      ],
    },
  ],
};

module.exports = sidebars;
