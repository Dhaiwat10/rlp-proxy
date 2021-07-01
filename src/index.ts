require('dotenv').config();
import express, { Response } from 'express';
import { getMetadata, getTweetDetails } from './lib';
import { APIOutput } from './types';

const app = express();

const port = Number(process.env.PORT || 8080);
const SERVER_URL = process.env.SERVER_URL;

const sendResponse = (res: Response, output: APIOutput | null) => {
  if (!output) {
    return res
      .set('Access-Control-Allow-Origin', '*')
      .status(400)
      .json({ metadata: null });
  }

  return res
    .set('Access-Control-Allow-Origin', '*')
    .status(200)
    .json({ metadata: output });
};

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use(express.static('public'));

app.get('/', async (req, res) => {
  const url = req.query.url as unknown as string;
  const metadata = await getMetadata(url);
  return res.set('Access-Control-Allow-Origin', '*').status(200).json({ metadata });
});

app.get('/v2', async (req, res) => {
  const url = req.query.url as unknown as string;

  const { hostname } = new URL(url);

  let output: APIOutput;

  // Twitter
  if (hostname.includes('twitter.com')) {
    const result = await getTweetDetails(url);
    if (!result) {
      return sendResponse(res, null);
    }
    const title = `${result.author} on Twitter`;
    const description = result.text;
    const siteName = 'Twitter';

    output = {
      title,
      description,
      siteName,
      image: SERVER_URL + '/tw-thumb.png',
      hostname,
    };

    return sendResponse(res, output);
  } else {
    const metadata = await getMetadata(url);
    if (!metadata) {
      return sendResponse(res, null);
    }
    const { images, og, meta } = metadata!;

    let image = og.image
      ? og.image
      : images.length > 0
      ? images[0].url
      : `${SERVER_URL}/img-placeholder.jpg`;
    const description = og.description
      ? og.description
      : meta.description
      ? meta.description
      : null;
    const title = (og.title ? og.title : meta.title) || '';
    const siteName = og.site_name || '';

    output = {
      title,
      description,
      image,
      siteName,
      hostname,
    };

    return sendResponse(res, output);
  }
});