const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: false,
    },
  },
  chainWebpack: (webpackConfig) => {
    if (!process.env.SSR) {
      return;
    }

    webpackConfig.entry('app').clear().add('./src/main.server.js');

    webpackConfig.target('node');
    webpackConfig.output.libraryTarget('commonjs2');

    webpackConfig.plugin('manifest').use(new WebpackManifestPlugin({ fileName: 'ssr-manifest.json' }));

    webpackConfig.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }));

    webpackConfig.optimization.splitChunks(false).minimize(false);

    webpackConfig.plugins.delete('hmr');
    webpackConfig.plugins.delete('preload');
    webpackConfig.plugins.delete('prefetch');
    webpackConfig.plugins.delete('progress');
    webpackConfig.plugins.delete('friendly-errors');
  },
  pwa: {
    name: "Geonosis",
    themeColor: "#151515",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      cacheId: "geo",
      navigateFallback: "index.html",
      exclude: [/_redirects/, /robots.txt/,/\.map$/, /manifest.*\.json$/],
      runtimeCaching: [
        {
          urlPattern: /.*\.(?:png|jpg|jpeg|gif|webp|ico|svg|eot|ttf|woff|json)$/,
          handler: "cacheFirst",
          options: {
            cacheName: "geo-assets",
            expiration: {
              maxAgeSeconds: 5 * 24 * 60 * 60, // 5 days
              purgeOnQuotaError: true
            }
          }
        }
      ]
    }
  }
};
