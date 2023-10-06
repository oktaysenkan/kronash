import { useRouter } from 'next/router';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span>Kronash</span>,
  project: {
    link: 'https://github.com/oktaysenkan/kronash',
  },
  docsRepositoryBase:
    'https://github.com/oktaysenkan/kronash/tree/main/apps/docs',
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Kronash',
      };
    }
  },
  editLink: {
    text: 'Edit this page on GitHub →',
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback',
  },
  footer: {
    text: <p className="text-xs">© {new Date().getFullYear()} Kronash</p>,
  },
  toc: {
    backToTop: true,
  },
};

export default config;
