const path = require('path')
const webpack = require('webpack')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: 'dist',
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('Images', resolve('src/assets/images'))
      .set('Components', resolve('src/components'))
      .set('Plugins', resolve('src/plugins'))

    config
      .plugin('ContextReplacementPlugin')
      .use(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/))
  },
  productionSourceMap: false,
  devServer: {
    open: true,
    proxy: {
      '/ss': {
        target: 'http://192.168.98.100',
        changOrigin: true,
        pathRewrite: {
          '^/ss': ''
        }
      }
    }
  }
}
