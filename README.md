# Payload Dynamic Collections Plugin

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Nebulaworks/payload-dynamic-collections)](https://github.com/Nebulaworks/payload-dynamic-collections/issues)
[![GitHub stars](https://img.shields.io/github/stars/Nebulaworks/payload-dynamic-collections)](https://github.com/Nebulaworks/payload-dynamic-collections/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Nebulaworks/payload-dynamic-collections)](https://github.com/Nebulaworks/payload-dynamic-collections/network)

## Overview

Payload Dynamic Collections is a plugin for Payload CMS that enhances its capabilities by introducing dynamic collections, allowing you to manage your database collections at runtime. This system leverages [PM2](https://pm2.keymetrics.io/) and local database storage to ensure your Payload server is always up to date! This system is great for projects that constantly need new collections or updates to the schema of old ones, as you no longer have to completely rebuild and re-deploy your Payload server each time.

## Features

- **Dynamic Collections:** Create and edit collections directly from the admin console, no re-deploying necessary
- **Version Management:** New collections aren't loaded until a new Version is created and selected. If something goes wrong, you can pick a new version at the click of a button!
- **Hooks and Access:** You can supply your own hooks and access functions that can be selected when configuring new collections

## Installation

1. Install the plugin.

    ``` sh
    yarn add @nebulaworks/payload-dynamic-collections
    or
    npm -i @nebulaworks/payload-dynamic-collections
    ```

1. Configure your runtime environment to use PM2
    - According to the PM2 homepage: "[PM2](https://pm2.keymetrics.io/) is a daemon process manager that will help you manage and keep your application online 24/7"
    - This plugin requires that "always on" mentality to instantly restart your payload server once it realizes it is out of date.
    - How PM2 is configured will likely be different depending on the specifics of your project, but an example of a very simple configuration can be found in the [dev](./dev/) folder with the [docker compose](./dev/docker-compose.yml) file and its [entrypoint script](./dev/entrypoint.sh)

    ```bash
    # entrypoint.sh
    yarn install
    cd dev
    yarn install
    yarn generate:types

    yarn global add pm2
    pm2 start yarn --interpreter sh -- dev
    pm2 logs --raw
    ```

1. Configure the plugin in your Payload config.
    - See the [usage](#usage) and [documentation](#documentation) sections below
1. Start creating dynamic collections!

## Usage

```js
// payload.config.ts
import type { Config } from 'payload/config'
import { buildConfig } from 'payload/config'
import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import Users from './collections/Users'
import type { DynamicCollectionOptions } from '../../src/index' // TODO: Change to module path
import { dynamicCollectionsPlugin } from '../../src/index' // TODO: Change to module path
import { collectionAccess, fieldAccess } from './access'
import hidden from './hidden'
import { collectionHooks, fieldHooks } from './hooks'

const dynamicCollectionOptions: DynamicCollectionOptions = {
  enabled: true,
  access: {
    createVersion: collectionAccess.isAdmin,
    viewVersions: collectionAccess.isAdmin,
    editCollections: collectionAccess.isAdmin,
    viewCollections: collectionAccess.isAdmin,
  },

  collectionAccessFunctions: collectionAccess,
  fieldAccessFunctions: fieldAccess,
  hiddenFunctions: hidden,
  collectionHooks,
  fieldHooks,
}

const conf: Config = {
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [dynamicCollectionsPlugin(dynamicCollectionOptions)],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
}

export default buildConfig(conf)

```

## Documentation

### The Config

### Creating New Collections

### Editing Fields

### Creating New Versions

### Access Functions

### Hidden Functions

### Hooks and Hooks with Props

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or inquiries, please contact Dan Haub at <dhaub@nebulaworks.com>.
