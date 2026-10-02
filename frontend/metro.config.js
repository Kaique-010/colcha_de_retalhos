const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

config.resolver.unstable_enablePackageExports = true

const alias = {
  tslib: require.resolve('tslib/tslib.es6.js'),
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  return context.resolveRequest(
    context,
    alias[moduleName] || moduleName,
    platform,
  )
}

module.exports = config
