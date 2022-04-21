import {Request, Response} from 'express';

/**
 * A utility for simpler async/await usage with
 * express routes
 *
 * @example
 * router.get('/', asyncWrapper(async () => ({fue: 'bar'})
 */
export const asyncWrapper = (fn: any, method = 'json') => (req: Request, res: Response) => {
  fn(req, res)
    .then((data: any) => {

      if (res.headersSent) {
        return;
      }

      // @ts-ignore
      res[method](data)
    })
    .catch((error: any) => {
      console.error(error);
      res.status(error.status || 500).send({
        message: error.toString()
      });
    });
};
