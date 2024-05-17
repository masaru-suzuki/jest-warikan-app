import fs from 'fs';
import { Expense } from '../type';
import { ExpenseRepository } from './expenseRepository';

// 実際にファイル操作は行わないため、jest.mock()でモック化
jest.mock('fs');

describe('ExpenseRepository', () => {
  const mockFs = jest.mocked(fs);
  let repo: ExpenseRepository;

  // テスト実行前にクリアされるようにする
  beforeEach(() => {
    mockFs.existsSync.mockClear();
    mockFs.readFileSync.mockClear();
    mockFs.writeFileSync.mockClear();
    repo = new ExpenseRepository('expenses.json');
  });

  describe('loadExpenses', () => {
    it('支出一覧が取得できる', () => {
      const expenses: Expense[] = [
        {
          groupName: 'group1',
          expenseName: 'expense1',
          payer: 'dog',
          amount: 100,
        },
        {
          groupName: 'group2',
          expenseName: 'expense2',
          payer: 'apple',
          amount: 200,
        },
      ];
      mockFs.existsSync.mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify(expenses));
      const result = repo.loadExpenses();
      expect(result).toEqual(expenses);
    });

    it('ファイルが存在しない場合は[]が返される', () => {
      mockFs.existsSync.mockReturnValueOnce(false);
      const result = repo.loadExpenses();
      expect(result).toEqual([]);
    });
  });

  describe('saveExpense', () => {
    it('支出が保存される', () => {
      const expense: Expense = {
        groupName: 'group1',
        expenseName: 'expense1',
        payer: 'dog',
        amount: 100,
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify([]));
      repo.saveExpense(expense);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        'expenses.json',
        JSON.stringify([expense])
      );
    });
  });
});
