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

  test.describe('支出登録機能', () => {
    test.beforeEach(async ({ page }) => {
      const groupNameInput = page.getByLabel('グループ名');
      await groupNameInput.fill('group1');
      const memberListInput = page.getByLabel('メンバー名');
      await memberListInput.fill('user1,user2,user3');

      const submitButton = page.getByRole('button');
      await submitButton.click();
    });

    test('支出が登録され精算リストが更新される', async ({ page }) => {
      const expenseNameInput = page.getByLabel('支出名');
      await expenseNameInput.fill('ランチ');
      const amountInput = page.getByLabel('金額');
      await amountInput.fill('1000');

      // selectの場合はこういうふうに書く！
      const paidBySelect = page.getByLabel('支払うメンバー');
      await paidBySelect.selectOption({ label: 'user1' });

      const submitButton = page.getByRole('button');
      await submitButton.click();

      // ページがそのままになっていることを確認
      await expect(page).toHaveURL(/.+\/group\/group1/);

      // 精算リストが表示されていることを確認
      // await expect(page.getByText('user2 → user1')).toBeVisible();
      // await expect(page.getByText('user3 → user1')).toBeVisible();

      // 💡POINT: user2 → user1      500円 とういうような見た目だが、スペースはCSSで入れているので、スペースを入れないでテキストを取得する
      //   await expect(page.getByRole('list')).toHaveText(
      //     'user2 → user1333円user3 → user1333円'
      //   );
      await expect(page.getByRole('list')).toHaveText(
        'user2 → user1333円user3 → user1333円'
      );
    });

    test('バリデーションエラーが存在する場合、支出が登録されず、精算リストが更新されない', async ({
      page,
    }) => {
      const submitButton = page.getByRole('button');
      await submitButton.click();

      // エラーメッセージが表示されていることを確認
      // page.get~なの注意
      await expect(page.getByText('支出名は必須です')).toBeVisible();
      await expect(
        page.getByText('金額は1円以上の整数で必須です')
      ).toBeVisible();
      await expect(page.getByText('支払うメンバーは必須です')).toBeVisible();

      // 精算リストが表示されていないことを確認
      await expect(page.getByRole('list')).toHaveText('');
    });
  });
});
