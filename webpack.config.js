const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: {
        temp: './temp.js',
    },
    output: {
        path: __dirname + '/build'
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "./images", to: "images", context: "." },
                { from: "./vss-extension.json", to: "vss-extension.json" },
                {
                    from: "./Task",
                    globOptions: {
                        dot: true,
                        gitignore: false,
                        ignore: ["**/Tests/**", "**/*.ts"],
                    },
                    to: "Task"
                },

            ]
        })
    ]
};