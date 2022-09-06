import dayjs from 'dayjs'
import type { LoaderFunction } from '@remix-run/node'

import { DOMAIN } from '~/utils/constants.server'
import { db } from '~/database/db.server'

export const loader: LoaderFunction = async () => {
  const [tracks, albums, artists, playlists] = await db.$transaction([
    db.track.findMany({
      orderBy: [{ uppdatedAt: 'desc' }],
      take: 50,
      select: {
        hash: true,
        uppdatedAt: true,
      },
    }),
    db.album.findMany({
      where: {
        tracks: {
          some: {},
        },
      },
      orderBy: [{ uppdatedAt: 'desc' }],
      take: 50,
      select: {
        hash: true,
        uppdatedAt: true,
      },
    }),
    db.artist.findMany({
      orderBy: [{ uppdatedAt: 'desc' }],
      where: {
        tracks: {
          some: {},
        },
      },
      take: 50,
      select: {
        hash: true,
        uppdatedAt: true,
      },
    }),

    db.playlist.findMany({
      orderBy: [{ uppdatedAt: 'desc' }],
      where: {
        tracks: {
          some: {},
        },
      },
      take: 200,
      select: {
        hash: true,
        uppdatedAt: true,
      },
    }),
  ])

  const allData = [
    ...tracks.map((t) => ({ ...t, type: 'track' })),
    ...artists.map((a) => ({ ...a, type: 'artist' })),
    ...albums.map((a) => ({ ...a, type: 'album' })),
    ...playlists.map((p) => ({ ...p, type: 'playlist' })),
  ].sort((a, b) => (a.uppdatedAt < b.uppdatedAt ? 1 : -1))

  const allItems = allData.map((single) => {
    return [
      `<url>`,
      `<loc>${DOMAIN}/${single.type}/${single.hash}</loc>`,
      `<lastmod>${dayjs(single.uppdatedAt).format('YYYY-MM-DD')}</lastmod>`,
      `</url>`,
    ].join('')
  })

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,

    // index page, or /blog page
    `<url>`,
    `<loc>${DOMAIN}</loc>`,
    `<lastmod>${dayjs(allData[0].uppdatedAt).format('YYYY-MM-DD')}</lastmod>`,
    `</url>`,

    ...allItems,
    `</urlset>`,
  ]

  const headers: HeadersInit = {
    'Content-Type': 'application/xml; charset=utf-8',
    'x-content-type-options': 'nosniff',
  }

  return new Response(xml.join(''), { headers })
}
