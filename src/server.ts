/**
 * TanStack Start server entry with Agentuity CDN asset rewriting.
 * @see https://agentuity.dev/frameworks/tanstack-start
 * @see https://tanstack.com/start/latest/docs/framework/react/guide/cdn-asset-urls
 */
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createServerEntry } from '@tanstack/react-start/server-entry'

const cdnOrigin =
  process.env.AGENTUITY_CDN_ORIGIN?.replace(/\/+$/, '') ??
  (process.env.AGENTUITY_CLOUD_DEPLOYMENT_ID
    ? `https://cdn.agentuity.com/${process.env.AGENTUITY_CLOUD_DEPLOYMENT_ID}`
    : undefined)

const handler = createStartHandler({
  handler: defaultStreamHandler,
  transformAssets: cdnOrigin
    ? { prefix: cdnOrigin, crossOrigin: 'anonymous' }
    : undefined,
})

export default createServerEntry({ fetch: handler })
