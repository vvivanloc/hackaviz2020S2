const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  return {
    context: path.resolve(__dirname, './'),

    entry: {
      app: './src/main.ts',
    },

    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, './'),
    },

    resolve: {
      extensions: ['.ts', '.js'],
    },

    devtool: 'source-map',

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
        {
          // FIXME
          test: /\.less$/,
          loader: 'less-loader',
        },
      ],
    },
    plugins: [
      new CopyPlugin([
        { from: './node_modules/leaflet/dist/leaflet.css', to: 'leaflet' },
        {
          from:
            './node_modules/leaflet-polylineoffset/leaflet.polylineoffset.js',
          to: 'leaflet',
        },
        {
          from: './node_modules/leaflet-ant-path/dist/leaflet-ant-path.es6.js',
          to: 'leaflet',
        },
        {
          from: './node_modules/leaflet.sync/L.Map.Sync.js',
          to: 'leaflet',
        },
        {
          from: './src/departureboard/js/departure-board.js',
          to: 'departure-board',
        }
      ]),
    ],
  };
};
