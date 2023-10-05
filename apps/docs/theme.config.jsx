export default {
    logo: <span
    >Kronash</span>,
    project: {
      link: 'https://github.com/oktaysenkan/kronash'
    },
    useNextSeoProps() {
      return {
        titleTemplate: '%s – Kronash',
      }
    },
    footer: {
      text: (
          <p className="text-xs">
            © {new Date().getFullYear()} Kronash
          </p>
      )
    },
  }