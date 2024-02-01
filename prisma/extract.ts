import fs from 'fs/promises'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run() {
  const results = await prisma.$transaction([
    prisma.genre.findMany(),
    prisma.account.findMany(),
    prisma.artist.findMany(),
    prisma.album.findMany(),
    prisma.track.findMany(),
    prisma.playlist.findMany(),
    prisma.playlistTracks.findMany(),
  ])

  const promises = results.map((list, index) => {
    return fs.writeFile(`./${index}.json`, JSON.stringify(list), 'utf-8')
  })

  await Promise.all(promises)
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
