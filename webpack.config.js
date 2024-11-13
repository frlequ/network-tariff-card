const path = require('path');

module.exports = {
  entry: './src/network-tariff-card.js', // Adjusted to your main JS file
  output: {
    filename: 'network-tariff-card.js', // The output file name (same name is fine)
    path: path.resolve(__dirname, 'dist'), // The output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Transpile for older browsers
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  mode: 'production', // Use 'development' for development builds
};
