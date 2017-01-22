"use strict";

const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = function (projectRoot, appConfig) {
    const appSrc = path.resolve(projectRoot, appConfig.src);
    const appMain = path.resolve(appSrc, appConfig.main);
    const appVendors = path.resolve(appSrc, appConfig.vendors);
    const appPolyfills = path.resolve(appSrc, appConfig.polyfills);

    return {
        context: path.resolve(__dirname, "./"),

        entry: {
            "polyfills": appPolyfills,
            "vendor": appVendors,
            "main": appMain
        },

        module: {
            rules: [
                {test: /\.ts$/, loaders: ["awesome-typescript-loader", 'angular2-template-loader']},
                {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', exclude: [/node_modules/]},
                {test: /\.scss$/, loaders: ['raw-loader', 'sass-loader']},
                {test: /\.css$/, loader: "raw-loader"},
                {test: /\.html$/, loader: 'raw-loader'},
                {test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'file?name=assets/[name].[hash].[ext]'}
            ]

        },

        plugins: [
            /* new AotPlugin({
                tsConfigPath: path.resolve(projectRoot, appConfig.tsconfig),
                entryModule: path.join(projectRoot, appConfig.src, appConfig.mainModule)
            }), */

            new HtmlWebpackPlugin({
                chunkSortMode: "dependency",
                // filename: path.resolve(appConfig.outDir, appConfig.index),
                template: path.resolve(appSrc, appConfig.index)
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: ["main", "vendor", "polyfills"]
            }),

            // Copy assets from the public folder
            // Reference: https://github.com/kevlened/copy-webpack-plugin
            new CopyWebpackPlugin([{
              from: path.resolve(appSrc, "public")
            }])

        ],

        resolve: {
            extensions: [".ts", ".js"],
            modules: [path.resolve(projectRoot, "node_modules")]
        },

        devServer: {
            contentBase: appConfig.outDir,
            port: 8080,
            host: "0.0.0.0",
            historyApiFallback: true,

            proxy: {
                "/api": {
                    target: "http://localhost:5000",
                    pathRewrite: {"^/api": ""}
                }
            }
        }
    };
};
