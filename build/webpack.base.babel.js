import path from "path"
import webpack from "webpack"
import VueLoaderPlugin from "vue-loader/lib/plugin"
import VuetifyLoader from "vuetify-loader/lib/plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import FaviconsWebpackPlugin from "favicons-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import autoprefixer from "autoprefixer"

const root = path.resolve(__dirname, "../")

const CLIENT_ID = process.env.CLIENT_ID
const BLOCKED_CATEGORIES = process.env.BLOCKED_CATEGORIES ? process.env.BLOCKED_CATEGORIES : "Auto & Vehicles,Comedy,Entertainment,Gaming,Howto & Style,Music,People & Blogs,Sports"

const postcssLoader = {
    loader: "postcss-loader",
    options: {
        sourceMap: true,
        plugins: [
            autoprefixer(),
        ],
    },
}

const baseConfig = {
    entry: {
        app: path.resolve(root, "src/app.js"),
    },
    output: {
        path: path.resolve(root, "dist/"),
        filename: "js/[name].js",
    },
    stats: {
        children: false,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {loader: "file-loader", options: {outputPath: "fonts/"}},
                ],
            },
        ],
    },
    resolve: {
        alias: {
            "vue$": path.resolve(root, "node_modules", "vue/dist/vue.runtime.esm.js"),
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            CLIENT_ID: JSON.stringify(CLIENT_ID),
            BLOCKED_CATEGORIES: JSON.stringify(BLOCKED_CATEGORIES.split(",")),
        }),
        new VueLoaderPlugin(),
        new VuetifyLoader(),
        new HtmlWebpackPlugin({
            template: path.resolve(root, "src/index.html"),
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(root, "src/img/favicon.png"),
            prefix: "icons/",
        }),
        new CopyWebpackPlugin({patterns: [{from: path.resolve(root, "src/img/google.svg"), to: "img/google.svg"}]}),
    ],
}

export {baseConfig, postcssLoader}
