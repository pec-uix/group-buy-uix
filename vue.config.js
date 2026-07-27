const path = require('path')
module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
  devServer: { disableHostCheck: true },
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './')
      }
    }
  }
}