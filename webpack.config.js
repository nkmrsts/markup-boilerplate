const HtmlWebPackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = (env, argv) => {
  const IS_DEVELOPMENT = argv.mode === 'development'
  return {
    // エントリーポイント
    entry: `./src/index.js`,

    output: {
      path: `${__dirname}/dist`,
      filename: 'bundle.js'
    },

    // ローカル開発用環境
    devServer: {
      contentBase: 'dist',
      open: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: ['> 1%', 'last 2 versions', 'not ie <= 8']
                  }
                ]
              ]
            }
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader'
            }
          ]
        },
        {
          test: /\.scss/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              // CSSをバンドルするための機能
              loader: 'css-loader',
              options: {
                url: true, // CSS内のurl()メソッドの取り込みを禁止する
                sourceMap: IS_DEVELOPMENT,
                // 0 => no loaders (default);
                // 1 => postcss-loader;
                // 2 => postcss-loader, sass-loader
                importLoaders: 2
              }
            },
            {
              // PostCSSの設定
              loader: 'postcss-loader',
              options: {
                sourceMap: IS_DEVELOPMENT
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: IS_DEVELOPMENT
              }
            }
          ]
        },
        {
          test: /\.(svg)(\?.+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/svg/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|ico)(\?.+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'images/[name].[ext]'
              }
            }
          ]
        }
      ]
    },
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
          uglifyOptions: { compress: { drop_console: true }, sourceMap: false }
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: { discardComments: { removeAll: true } }
        })
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'style.css'
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html'
      }),
      new HtmlWebpackInlineSVGPlugin()
    ]
  }
}
