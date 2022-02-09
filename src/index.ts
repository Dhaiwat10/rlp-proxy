require('dotenv').config();
import express, { Response } from 'express';
import { getMetadata } from './lib';
import { checkForCache, createCache } from './lib/cache';
import { errorResponse, successResponse } from './lib/response';
import { APIOutput } from './types';

const app = express();

const port = Number(process.env.PORT || 8080);

if (process.env.REDISTOGO_URL) {
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var redis = require('redis').createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(':')[1]);
} else {
  var redis = require('redis').createClient();
}

const limiter = require('express-limiter')(app, redis);
//release
limiter({
  path: '/v2',
  method: 'get',
  lookup: ['connection.remoteAddress'],
  // 300 requests per minute
  total: 300,
  expire: 1000 * 60,
});

const sendResponse = (res: Response, output: APIOutput | null) => {
  if (!output) {
    const data:APIOutput = {
      title : null,
      description : null,
      image : null,
      sitename : null,
      hostname : null,
    };

    return res
      .set('Access-Control-Allow-Origin', '*')
      .status(200)
      .json(errorResponse(data,404,"Not found"));
  }

  return res
    .set('Access-Control-Allow-Origin', '*')
    .status(200)
    .json(successResponse(output));
};

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use(express.static('public'));

app.get('/', async (req, res) => {
  const url = req.query.url as unknown as string;
  const metadata = await getMetadata(url);
  return res
    .set('Access-Control-Allow-Origin', '*')
    .status(200)
    .json({ metadata });
});

app.get('/v2', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=2592000')
  try {
    let url = req.query.url as unknown as string;

    if (!url) {
      return res
        .set('Access-Control-Allow-Origin', '*')
        .status(400)
        .json({ error: 'Invalid URL' });
    }

    url = url.indexOf('://') === -1 ? 'http://' + url : url;

    const isUrlValid =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
        url
      );

    if (!url || !isUrlValid) {
      return res
        .set('Access-Control-Allow-Origin', '*')
        .status(400)
        .json({ error: 'Invalid URL' });
    }

    if (url && isUrlValid) {
      const { hostname } = new URL(url);

      let output: APIOutput;
      // optional - you'll need a supabase key if you want caching. highly recommended.
      const cached = await checkForCache(url);

      if (cached) {
        sendResponse(res, cached);
      }

      const metadata = await getMetadata(url);
      if (!metadata) {
        return sendResponse(res, null);
      }
      const { images, og, meta } = metadata!;

      let image = og.image
        ? og.image
        : images.length > 0
        ? images[0].src
        : null;
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
        sitename : siteName,
        hostname,
      };

      sendResponse(res, output);

      if (!cached && output) {
        await createCache({
          url,
          title: output.title,
          description: output.description,
          image: output.image,
          sitename: output.sitename,
          hostname: output.hostname,
        });
      }
    }
  } catch (error) {
    return res.set('Access-Control-Allow-Origin', '*').status(500).json(errorResponse(null,500,"Error"));
  }
});
