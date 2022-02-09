interface Image {
  src: string;
}

export interface APIOutput {
  title: string | null;
  description: string | null;
  image: string | null;
  sitename: string | null;
  hostname: string | null;
}

export interface ResponseOutput {
  status : {
    error_code : number,
    error_message : string,
    error_alert : string
  },
  data : APIOutput | null
}

export interface MetaResult {
  images: Array<Image>;
  meta: {
    description?: string;
    title?: string;
  };
  og: {
    image?: string;
    description?: string;
    title?: string;
    images?: Array<Image>;
    site_name?: string;
    type?: string;
    url?: string;
    videos?: Array<Image>;
  };
}
