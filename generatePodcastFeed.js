const fs = require('fs');
const path = require('path');
const { create } = require('xmlbuilder2');

const BASE_URL = 'https://nullquanta.github.io/personal-podcast'; 
const MP3_DIR = './episodes'; // Folder where your mp3s are stored
const FEED_FILE = './rss.xml';

const feedInfo = {
  title: 'NullQuanta Podcast',
  description: 'Private podcast feed for personal use.',
  link: BASE_URL,
  language: 'en-us',
  author: 'NullQuanta',
  category: 'Personal',
};

function getMP3Files(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mp3'))
    .map(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      return {
        title: path.basename(file, '.mp3'),
        url: `${BASE_URL}/${path.basename(MP3_DIR)}/${file}`,
        size: stats.size,
        pubDate: stats.mtime.toUTCString(),
        guid: path.basename(file),
      };
    });
}

function buildRSS(feedItems) {
  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('rss', { version: '2.0', 'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd' })
    .ele('channel');

  root.ele('title').txt(feedInfo.title).up()
    .ele('link').txt(feedInfo.link).up()
    .ele('description').txt(feedInfo.description).up()
    .ele('language').txt(feedInfo.language).up()
    .ele('itunes:author').txt(feedInfo.author).up()
    .ele('itunes:explicit').txt('false').up()
    .ele('itunes:category', { text: feedInfo.category }).up();

  for (const item of feedItems) {
    root.ele('item')
      .ele('title').txt(item.title).up()
      .ele('enclosure', { url: item.url, length: item.size, type: 'audio/mpeg' }).up()
      .ele('guid').txt(item.guid).up()
      .ele('pubDate').txt(item.pubDate).up()
      .ele('description').txt(`Episode: ${item.title}`).up()
      .up();
  }

  return root.end({ prettyPrint: true });
}

const items = getMP3Files(MP3_DIR);
const rss = buildRSS(items);
fs.writeFileSync(FEED_FILE, rss);
console.log(`Generated RSS feed with ${items.length} episodes.`);
