import fs from 'fs'; // テスト用のjsonファイルをリセット
import { createApp } from '../src/app'; // テスト対象のアプリケーションをインポート
import request from 'supertest';
import { Expense, Group } from '../src/type';
import express from 'express';

const GROUP_FILE_PATH = '../data/integration/groups.json';
const EXPENSE_FILE_PATH = '../data/integration/expenses.json';

const testGroups: Group[] = [
  {
    name: 'group1',
    members: ['一郎', '二郎', '三郎'],
  },
  {
    name: 'group2',
    members: ['太郎', '花子'],
  },
];
const testExpenses: Expense[] = [
  {
    groupName: 'group1',
    expenseName: 'ランチ',
    payer: '一郎',
    amount: 1000,
  },
];

describe('Integration Test', () => {
  // ARRANGE: テストの準備
  let app: express.Express;

  beforeEach(() => {
    // テスト用のjsonファイルをリセット=>データの追加
    fs.writeFileSync(GROUP_FILE_PATH, JSON.stringify(testGroups));
    fs.writeFileSync(EXPENSE_FILE_PATH, JSON.stringify(testExpenses));
    app = createApp(GROUP_FILE_PATH, EXPENSE_FILE_PATH);
  });

  // ACT: テストの実行
  // request.httpのテストみたいな感じ？
  describe('GET /groups', () => {
    it('全てのグループが取得できる', async () => {
      const response = await request(app).get('/groups');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(testGroups);
    });
  });

  describe('POST /groups', () => {
    it('グループが追加できる', async () => {
      const newGroup: Group = {
        name: '鈴木家',
        members: ['大', '伶奈', '萌生', '希実'],
      };
      const resultGroups: Group[] = [...testGroups, newGroup];
      const response = await request(app).post('/groups').send(newGroup); // sendを使ってリクエストボディを送信
      expect(response.status).toBe(200);
      expect(response.text).toBe('グループの作成が成功しました');
      // data/integration/groups.jsonの内容が更新されているか確認
      const groups = JSON.parse(fs.readFileSync(GROUP_FILE_PATH, 'utf8'));
      expect(groups).toEqual(resultGroups);
    });
  });
});
