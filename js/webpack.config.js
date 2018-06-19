const webpack = require('webpack')
const path = require('path')
const endPath = path.resolve(__dirname, 'build') // 'build' es la carpeta de destino, la version para producción

module.exports = {
  // --------------------------------------------------------------------------
  // To improve the webpack.config.js
  // resolve to declare to our config what extensions support
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  // cache to activate the cache and ahorrar tiempo
  cache: true,
  // --------------------------------------------------------------------------
  // entry puede ser un string, un objeto - para varias entradas (varias rutas) que jalen varios componentes, o un vector
  entry: [
    // Entrada
    './src/app.jsx'
    // Activa el Hot Module Reloading HMR para React para el puerto definido en el dev-server
    'webpack-dev-server/client?http://localhost:9000',
    // para que el webpack server solo ejecute hot reload y no el bundle final, mejorando el tiempo de desarrollo
    'webpack/hot/only-dev-server'
  ],
  // output puede ser un string, objeto o vector
  output: {
    // path es la ruta del bundle o build (versión de producción)
    path: endPath,
    // archivo final(de salida) de webpack que se ubica dentro del path declarado en 'path:'
    filename: 'app.js',
    // declarar dónde estará la carpeta pública
    publicPath: '/' // Necesario para el Hot-Reloading
  },
  module: {
    // rules genera un arreglo de reglas - por lo menos necesita una espresión regular (test) y qué transformación usar (use)
    rules: [
      {
        // para configurar babel, pasar ES6 a ES5
        test: /\.(js|jsx)$/, // que babel se aplique a archivos js o jsx
        exclude: '/node_modules/', // excluir el node_modules
        use: 'babel-loader'
      },
      {
        // para configurar json
        test: /\.json$/,
        use: 'js-loader'
      },
      {
        // para configurar css
        test: /\.scc$/,
        use: [
          'style-loader',
          {
            // para ver a los css como módulos:
            loader: 'css-loader',
            options: { modules: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  // devtools para generar sources maps con la 'react-developers-tool'
  devtools: 'inline-source-map',
  // devServer es un objeto para levantar el servidor de webpack
  devServer: {
    // para utilizar el módulo de hot reload
    hot: true,
    // la carpeta pública o final de la aplicación
    contentBase: endPath,
    // para no generar un bundle con cada cambio, sino que guardar la aplicación en caché y se implementan en el bundle solo los cambios que se hagan
    inline: true,
    // para comprimir recursos
    compress: true,
    port: 9000,
    // ruta del directorio público
    publicPath: '/'
  }
}
