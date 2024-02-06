import type { Config } from 'payload/config'
import type { Configuration as WebpackConfig } from 'webpack'

/**
 * Extends the webpack configuration
 * @param config The Payload configuration
 * @returns The extended webpack configuration
 */
export const extendWebpackConfig =
  (config: Config): ((webpackConfig: WebpackConfig) => WebpackConfig) =>
  webpackConfig => {
    const existingWebpackConfig =
      typeof config.admin?.webpack === 'function'
        ? config.admin.webpack(webpackConfig)
        : webpackConfig

    const newWebpack = {
      ...existingWebpackConfig,
      resolve: {
        ...(existingWebpackConfig.resolve || {}),
        alias: {
          ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
          fs: false as const,
        },
      },
    }

    return newWebpack
  }
