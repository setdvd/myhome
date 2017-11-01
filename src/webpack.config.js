const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/frontend/app.tsx',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/../' + 'dist')
  },
  
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        use: [{loader: 'awesome-typescript-loader'}]
      },
      {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'}
    ]
  },
  stats: {
    warnings: false
  },
  
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}