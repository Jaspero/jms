import * as functions from 'firebase-functions';

let config: any = functions.config();

config = {
  ...config,
  ...config[process.env.NODE_ENV === 'production' ? 'prod' : 'dev']
};

delete config['prod'];
delete config['dev'];

export const ENV_CONFIG = config as {
  sendgrid?: {
    key: string;
  };
  email?: {
    name: string;
    email: string;
  },

  /**
   * Secret for email token HMAC
   */
  esecret: string;
};
