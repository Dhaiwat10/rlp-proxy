import { MetaResult } from '../types';
// @ts-ignore
import Meta from 'html-metadata-parser';
import axios from 'axios';

const TWITTER_API_URL = 'https://api.twitter.com/2';

const twApi = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.TW_BEARER_TOKEN}`,
  },
  baseURL: TWITTER_API_URL,
});

export const getMetadata = async (url: string): Promise<MetaResult | null> => {
  try {
    const result = (await Meta.parser(url)) as MetaResult;
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getAuthor = async (id: string) => {
  try {
    const result = await twApi.get(`/users/${id}`, {
      params: {
        'user.fields': 'name',
      },
    });
    return result.data.data.name;
  } catch (err) {
    console.log(err);
    return null;
  }
};

interface TweetMetadata {
  text: string;
  author: string;
}

export const getTweetDetails = async (
  url: string
): Promise<TweetMetadata | null> => {
  try {
    const ungrouped = url.split('/');
    let tweetId = ungrouped[ungrouped.length - 1];
    tweetId = tweetId.split('?')[0];
    const result = await twApi.get(`/tweets/${tweetId}`, {
      params: {
        'tweet.fields': 'attachments,text,author_id',
        'media.fields': 'preview_image_url,url',
      },
    });
    const { author_id, text } = result.data.data;

    const author = await getAuthor(author_id);

    const output = {
      author,
      text,
    };

    return output;
  } catch (err) {
    console.log(err);
    return null;
  }
};
