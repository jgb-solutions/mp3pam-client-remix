-- CreateEnum
CREATE TYPE "ACCOUNT_TYPE" AS ENUM ('artist', 'user');

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uppdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "avatar" TEXT,
    "fbAvatar" TEXT,
    "fbId" TEXT,
    "fbLink" TEXT,
    "twitterAvatar" TEXT,
    "twitterId" TEXT,
    "twitterLink" TEXT,
    "phone" TEXT,
    "type" "ACCOUNT_TYPE" NOT NULL DEFAULT 'user',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "resetCode" TEXT,
    "firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "imgBucket" TEXT,
    "rememberToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uppdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "hash" INTEGER NOT NULL,
    "poster" TEXT,
    "imgBucket" TEXT,
    "accountId" INTEGER NOT NULL,
    "bio" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uppdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "hash" INTEGER NOT NULL,
    "audioName" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "imgBucket" TEXT NOT NULL,
    "audioBucket" TEXT NOT NULL,
    "featured" INTEGER,
    "detail" TEXT,
    "lyrics" TEXT,
    "audioFileSize" INTEGER,
    "accountId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    "albumId" INTEGER,
    "genreId" INTEGER NOT NULL,
    "number" INTEGER,
    "playCount" INTEGER DEFAULT 0,
    "downloadCount" INTEGER DEFAULT 0,
    "publish" INTEGER,
    "allowDownload" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uppdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "hash" INTEGER NOT NULL,
    "cover" TEXT NOT NULL,
    "imgBucket" TEXT NOT NULL,
    "detail" TEXT,
    "accountId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uppdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "hash" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uppdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistTracks" (
    "trackId" INTEGER NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaylistTracks_pkey" PRIMARY KEY ("trackId","playlistId")
);

-- CreateTable
CREATE TABLE "_Favorites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_hash_key" ON "Artist"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Track_hash_key" ON "Track"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Album_hash_key" ON "Album"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_hash_key" ON "Playlist"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "_Favorites_AB_unique" ON "_Favorites"("A", "B");

-- CreateIndex
CREATE INDEX "_Favorites_B_index" ON "_Favorites"("B");

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTracks" ADD CONSTRAINT "PlaylistTracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTracks" ADD CONSTRAINT "PlaylistTracks_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Favorites" ADD CONSTRAINT "_Favorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Favorites" ADD CONSTRAINT "_Favorites_B_fkey" FOREIGN KEY ("B") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
