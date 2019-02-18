const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const ImageminPlugin = require('imagemin-webpack')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminOptipng = require('imagemin-optipng')
const imageminSvgo = require('imagemin-svgo')

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
      open: true,
      host: '0.0.0.0'
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
          test: /\.ejs$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                attrs: ['img:src', 'img:srcset', 'source:srcset'],
                interpolate: true
              }
            },
            {
              loader: 'ejs-html-loader'
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
          test: /\.(otf|woff|woff2)(\?.+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|ico|svg)(\?.+)?$/,
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
        // template: './src/index.html',
        filename: './index.html',
        template: './src/index.ejs'
      }),
      new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        cache: true,
        imageminOptions: {
          // Lossless optimization with custom option
          // Feel free to experement with options for better result for you
          plugins: [
            imageminGifsicle({
              interlaced: true
            }),
            /* imageminJpegtran({
              progressive: true
            }), */
            imageminMozjpeg({
              quality: 80
            }),
            imageminOptipng({
              optimizationLevel: 5
            }),
            imageminSvgo({
              removeViewBox: true
            })
          ]
        }
      }),
      new CleanWebpackPlugin(['dist'], {
        dry: IS_DEVELOPMENT
      })
    ]
  }
}
