import { test, expect } from '@playwright/test';
import axios from 'axios';

// 実際に値を変更する副作用があるので、テスト実行後に元に戻す
test.describe('割り勘アプリ', () => {
  test.beforeEach(async ({ page }) => {
    //
    // どうやってローカルホストを立ち上げている？→backendとfrontendディレクトリに移動して、それぞれのディレクトリでyarn devを実行している
    await axios.get('http://localhost:3000/init');
    await page.goto('http://localhost:3001');
  });

  // backendとfrontendを
  test.describe('グループ作成', () => {
    test('グループが作成され、支出登録ページに遷移する', async ({ page }) => {
      const groupNameInput = page.getByLabel('グループ名');
      console.log(groupNameInput);
      await groupNameInput.fill('group1');
      const memberListInput = page.getByLabel('メンバー名');
      await memberListInput.fill('user1,user2,user3');

      const submitButton = page.getByRole('button');
      await submitButton.click();

      // URLが支出登録ページになっていることを確認
      //   await expect(page).toHaveURL('http://localhost:3001/group/group1');
      await expect(page).toHaveURL(/.+\/group\/group1/);
    });

    test('バリデーションエラーがある場合には、支出登録ページに遷移しない', async ({
      page,
    }) => {
      // --- ここは不要だった ---
      //   const groupNameInput = page.getByLabel('グループ名');
      //   await groupNameInput.fill('');
      //   const memberListInput = page.getByLabel('メンバー名');
      //   await memberListInput.fill('');
      // --- ここは不要だった ---

      const submitButton = page.getByRole('button');
      await submitButton.click();

      // エラーメッセージが表示されていることを確認
      // page.get~なの注意
      await expect(page.getByText('グループ名は必須です')).toBeVisible();
      await expect(page.getByText('メンバーは2人以上必要です')).toBeVisible();

      // URLが支出登録ページになっていることを確認
      await expect(page).not.toHaveURL(/.+\/group\/group1/);
    });
  });
});
