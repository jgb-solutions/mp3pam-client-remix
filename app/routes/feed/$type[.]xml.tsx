import { Feed } from 'feed'
import type { Item as FeedItem } from 'feed'
import type { LoaderFunction } from '@remix-run/node'

import {
  DOMAIN,
  ALBUM_DEFAULT_POSTER,
  ARTIST_DEFAULT_POSTER,
} from '~/utils/constants.server'
import { db } from '~/database/db.server'
import { APP_NAME } from '~/utils/constants'
import { getResourceUrl } from '~/database/requests.server'

type FeedType = 'track' | 'artist' | 'playlist' | 'album'

const buildFeed = ({
  data,
  type,
}: {
  data: FeedItem[]
  type: string
}): string => {
  const feed = new Feed({
    title: `${APP_NAME} Feed`,
    description: `This is ${APP_NAME} feed`,
    id: `${DOMAIN}`,
    link: `${DOMAIN}`,
    language: `en`,
    image: `${DOMAIN}/assets/images/social-media-share.png`,
    favicon: `${DOMAIN}/favicon.ico`,
    copyright: `All rights reserved 2013, John Doe`,
    updated: data[0].date,
    // feedLinks: {
    //   json: `https://example.com/json`,
    //   atom: `https://example.com/atom`,
    // },
    author: {
      name: 'Jean Gérard Bousiquot',
      email: `jgbneatdesign@gmail.com`,
      link: `https://bousiquot.com`,
    },
  })

  data.forEach((item) => {
    feed.addItem(item)
  })

  feed.addCategory(type.toUpperCase())

  feed.addContributor({
    name: 'Jean Gérard Bousiquot',
    email: 'jgbneatdesign.com',
    link: 'https://bousiquot',
  })

  // console.log(feed.rss2())
  // Output: RSS 2.0

  // console.log(feed.atom1())
  // Output: Atom 1.0

  // console.log(feed.json1())
  // Output: JSON Feed 1.0
  return feed.rss2()
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { type } = params as { type: FeedType }

  let feed = ''

  switch (type) {
    case 'track':
      const tracks = await db.track.findMany({
        orderBy: [{ createdAt: 'desc' }],
        take: 50,
        select: {
          title: true,
          hash: true,
          createdAt: true,
          imgBucket: true,
          poster: true,
          artist: {
            select: {
              stageName: true,
              hash: true,
            },
          },
        },
      })

      feed = buildFeed({
        data: tracks.map((track) => ({
          title: track.title,
          id: track.hash.toString(),
          link: `${DOMAIN}/track/${track.hash}`,
          description: `Listen to ${track?.title} by ${track.artist.stageName} on ${APP_NAME}`,
          content: `Listen to ${track?.title} by ${track.artist.stageName} on ${APP_NAME}`,
          author: [
            {
              name: track.artist.stageName,
              link: `${DOMAIN}/artist/${track.artist.hash}`,
            },
          ],
          date: track.createdAt,
          image: getResourceUrl({
            bucket: track.imgBucket,
            resource: track.poster,
          }),
        })),
        type,
      })
      break
    case 'album':
      const albums = await db.album.findMany({
        where: {
          tracks: {
            some: {},
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        take: 50,
        select: {
          title: true,
          hash: true,
          createdAt: true,
          imgBucket: true,
          cover: true,
          artist: {
            select: {
              stageName: true,
              hash: true,
            },
          },
        },
      })

      feed = buildFeed({
        data: albums.map((album) => ({
          title: album.title,
          id: album.hash.toString(),
          link: `${DOMAIN}/album/${album.hash}`,
          description: `Listen to album ${album?.title} by ${album.artist.stageName} on ${APP_NAME}`,
          content: `Listen to album ${album?.title} by ${album.artist.stageName} on ${APP_NAME}`,
          author: [
            {
              name: album.artist.stageName,
              link: `${DOMAIN}/artist/${album.artist.hash}`,
            },
          ],
          date: album.createdAt,
          image:
            album.cover && album.imgBucket
              ? getResourceUrl({
                  bucket: album.imgBucket,
                  resource: album.cover,
                })
              : ALBUM_DEFAULT_POSTER,
        })),
        type,
      })
      break

    case 'artist':
      const artist = await db.artist.findMany({
        orderBy: [{ createdAt: 'desc' }],
        where: {
          tracks: {
            some: {},
          },
        },
        take: 50,
        select: {
          name: true,
          hash: true,
          createdAt: true,
          imgBucket: true,
          poster: true,
          account: {
            select: {
              name: true,
            },
          },
        },
      })

      feed = buildFeed({
        data: artist.map((artist) => ({
          title: artist.name,
          id: artist.hash.toString(),
          link: `${DOMAIN}/artist/${artist.hash}`,
          description: `Listen to artist ${artist.name} posted by ${artist.account.name} on ${APP_NAME}`,
          content: `Listen to artist ${artist.name} posted by ${artist.account.name} on ${APP_NAME}`,
          author: [
            {
              name: artist.account.name,
              link: `${DOMAIN}/artist/${artist.hash}`,
            },
          ],
          date: artist.createdAt,
          image:
            artist.imgBucket && artist.poster
              ? getResourceUrl({
                  bucket: artist.imgBucket,
                  resource: artist.poster,
                })
              : ARTIST_DEFAULT_POSTER,
        })),
        type,
      })
      break

    case 'playlist':
      const playlists = await db.playlist.findMany({
        orderBy: [{ createdAt: 'desc' }],
        where: {
          tracks: {
            some: {},
          },
        },
        take: 50,
        select: {
          title: true,
          hash: true,
          createdAt: true,
          account: {
            select: {
              name: true,
            },
          },
        },
      })

      feed = buildFeed({
        data: playlists.map((playlist) => ({
          title: playlist.title,
          id: playlist.hash.toString(),
          link: `${DOMAIN}/playlist/${playlist.hash}`,
          description: `Listen to playlist ${playlist.title} posted by ${playlist.account.name} on ${APP_NAME}`,
          content: `Listen to playlist ${playlist.title} posted by ${playlist.account.name} on ${APP_NAME}`,
          author: [
            {
              name: playlist.account.name,
              link: `${DOMAIN}/playlist/${playlist.hash}`,
            },
          ],
          date: playlist.createdAt,
          image: ALBUM_DEFAULT_POSTER,
        })),
        type,
      })
      break

    // default:
    //   break
  }

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml;charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  })
}
