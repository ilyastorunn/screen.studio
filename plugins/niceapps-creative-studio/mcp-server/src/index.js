#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { fetchCatalog, importAppStore, searchCatalog } from './catalog.js'

const server = new McpServer({ name: 'niceapps-catalog', version: '0.1.0' })

const asToolResult = data => ({
  content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  structuredContent: { result: data },
})

server.registerTool('search_apps', {
  title: 'Search niceapps.club',
  description: 'Find screenshot references in the niceapps.club catalog. Results are candidates, not conversion evidence.',
  inputSchema: {
    query: z.string().default('').describe('Product, audience, feature, style, or communication terms'),
    category: z.string().default('').describe('Optional exact App Store category'),
    limit: z.number().int().min(1).max(20).default(8),
  },
}, async input => asToolResult(searchCatalog(await fetchCatalog(), input)))

server.registerTool('get_app', {
  title: 'Get niceapps.club app',
  description: 'Get one catalog app and its screenshot URLs by slug.',
  inputSchema: { slug: z.string().min(1) },
}, async ({ slug }) => {
  const app = (await fetchCatalog()).find(item => item.slug === slug)
  if (!app) throw new Error(`No niceapps.club app found for slug: ${slug}`)
  return asToolResult(app)
})

server.registerTool('import_app_store', {
  title: 'Import App Store context',
  description: 'Load public App Store metadata and current screenshots from an App Store URL or Apple ID.',
  inputSchema: { input: z.string().min(1).describe('App Store URL or numeric Apple ID') },
}, async ({ input }) => asToolResult(await importAppStore(input)))

await server.connect(new StdioServerTransport())
