const path = require('path');

module.exports = {
  entry: './src/index.js', // Seu ponto de entrada do React
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  externals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: 'production' // ou 'development'
};
  