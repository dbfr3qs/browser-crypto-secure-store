const path = require('path');
module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "browser-crypto-secure-store.js",
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    module: {
        rules: [{ test: /\.ts$/, loader: "ts-loader" }]
    },
    mode: 'development'
}
