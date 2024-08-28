import { act, renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './../../mock/handler';
import { useApi } from './useApi';

// テスト用のサーバーをセットアップ
const server = setupServer(...handlers);
const url = 'http://localhost:3002/test';

describe('useApi', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers()); // テストごとにhandlerをリセット

  describe('GET', () => {
    it('データを取得できる', async () => {
      const { result } = renderHook(() => useApi(url));
      console.log(result);
      await waitFor(() => expect(result.current.data).not.toBeNull());

      console.log(result);

      expect(result.current.data).toEqual({ message: 'get data' });
      expect(result.current.error).toBeNull();
    });

    it('GETリクエストでエラーが発生する', async () => {
      // サーバーのモックを500エラーを返すように上書き
      server.use(
        rest.get(url, (_, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      const { result } = renderHook(() => useApi(url));
      console.log(result);
      await waitFor(() =>
        expect(result.current.error).toBe('エラーが発生しました')
      );
      console.log(result);
    });
  });

  describe('POST', () => {
    it('POST処理が実行される', async () => {
      const { result } = renderHook(() => useApi(url));
      let res;
      // actにもawaitをつける
      await act(async () => {
        res = await result.current.postData('test', url);
      });
      expect(res!.data).toEqual({ message: 'post data' });
      expect(result.current.error).toBeNull();
    });

    it('GETリクエストでエラーが発生する', async () => {
      // サーバーのモックを500エラーを返すように上書き
      server.use(
        rest.post(url, (_, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      const { result } = renderHook(() => useApi(url));
      await act(async () => {
        await result.current.postData('test', url);
      });
      // なんでwaitForが必要なのかわからない
      //  act の後すぐに expect を実行した場合、まだエラーメッセージが設定されていないタイミングで検証が行われる可能性があります。waitFor を使うことで、そのエラーメッセージが確実に設定されるまで待機し、その後に検証を行うことができるため、テストがより堅牢になります。
      await waitFor(() => {
        expect(result.current.error).toBe('エラーが発生しました');
      });
    });
  });
});
