import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:3002/test', (_, res, ctx) => {
    return res(ctx.json({ message: 'get data' }));
  }),
  rest.post('http://localhost:3002/test', (_, res, ctx) => {
    return res(ctx.json({ message: 'post data' }));
  }),
];
