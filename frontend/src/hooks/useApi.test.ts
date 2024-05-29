import { renderHook, waitFor } from '@testing-library/react';
import { handlers } from './../../mock/handler';
import { useApi } from './useApi';
// import { rest } from 'msw';
import { setupServer } from 'msw/node';

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

      expect(result.current.data).toEqual({ message: 'get data' });
      expect(result.current.error).toBeNull();
    });

    it('GETリクエストでエラーが発生する', async () => {
      const { result } = renderHook(() => useApi(url));
      console.log(result);
      await waitFor(() => expect(result.current.data).not.toBeNull());

      expect(result.current.data).toEqual({ message: 'get data' });
      expect(result.current.error).toBeNull();
    });
  });
});
