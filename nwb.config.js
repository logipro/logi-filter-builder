module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'LogiFilterBuilder',
      externals: {
        react: 'React'
      }
    }
  }
}
