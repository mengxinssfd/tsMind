const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: {
        example: "./src/example/main.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[hash:4].js"
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlPlugin({
            template: './src/example/index.html',
            filename: 'index.html',
            chunks: ['example'],// 于loader一样，在后面的会插到前面去
        })
    ],
    devServer: {
        // publicPath: '/',
        port: 8080,
    },
};