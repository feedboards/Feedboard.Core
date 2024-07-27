const path = require('path');

module.exports = {
    mode: 'development', // or 'production'
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@azure/identity': path.resolve(__dirname, 'node_modules/@azure/identity'),
            '@azure/core-auth': path.resolve(__dirname, 'node_modules/@azure/core-auth'),
            '@azure/arm-eventhub': path.resolve(__dirname, 'node_modules/@azure/arm-eventhub'),
            '@azure/arm-resources': path.resolve(__dirname, 'node_modules/@azure/arm-resources'),
            '@azure/arm-subscriptions': path.resolve(__dirname, 'node_modules/@azure/arm-subscriptions'),
            '@azure/event-hubs': path.resolve(__dirname, 'node_modules/@azure/event-hubs'),
        },
        fallback: {
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            util: require.resolve('util/'),
        },
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'module',
        module: true,
    },
    experiments: {
        outputModule: true,
    },
};
