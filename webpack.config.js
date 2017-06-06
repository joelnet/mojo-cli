module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'dist/index.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-2']
                }
            }
        ]
    },
}
