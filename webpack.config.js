const path = require('path')

// Switch to production mode when deployed on Glitch.
let mode = process.env.PROJECT_DOMAIN ? 'production' : 'development'

module.exports = {
  mode,
  entry: './client/App.jsx',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
}
