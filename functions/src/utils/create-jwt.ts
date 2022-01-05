import {sign} from 'jsonwebtoken';
import {ENV_CONFIG} from '../consts/env-config.const';

export function createJwt(data: any,  expiresIn = '365d') {
  return sign(
    data,
    ENV_CONFIG.esecret,
    {expiresIn}
  );
}
