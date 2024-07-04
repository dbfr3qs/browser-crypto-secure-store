const path = require('path');
module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "browser-crypto-secure-store.js",
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        library: {
            name: 'BrowserCryptoSecureStore',
            type: 'umd',
            export: 'default'
        },
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    module: {
        rules: [{ test: /\.ts$/, loader: "ts-loader" }]
    },
    mode: 'development'
}
