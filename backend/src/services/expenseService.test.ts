import { ExpenseRepository } from '../repositories/expenseRepository';
import { Expense, Group, Settlement } from '../type';
import { calculateSettlements } from '../utils/settlements';
import { ExpenseService } from './expenseService';
import { GroupService } from './groupService';

describe('ExpenseService', () => {
  // 依存を注入する場合のテスト
  let mockExpenseRepository: Partial<ExpenseRepository>;
  let mockGroupService: Partial<GroupService>;
  let expenseService: ExpenseService;

  const group: Group = { name: 'group1', members: ['一郎', '二郎'] };
  const expense: Expense = {
    groupName: 'group1',
    expenseName: 'ランチ',
    amount: 2000,
    payer: '一郎',
  };

  beforeEach(() => {
    mockExpenseRepository = {
      saveExpense: jest.fn(),
      loadExpenses: jest.fn(),
    };

    mockGroupService = {
      getGroupByName: jest.fn(),
    };

    expenseService = new ExpenseService(
      mockExpenseRepository as ExpenseRepository,
      mockGroupService as GroupService
    );
  });
  describe('addExpense', () => {
    it('支出が登録される', () => {
      mockGroupService.getGroupByName = jest.fn().mockReturnValueOnce(group);
      expenseService.addExpense(expense);
      expect(mockExpenseRepository.saveExpense).toHaveBeenCalledWith(expense);
    });

    it('グループが存在しない場合はエラーが発生する', () => {
      mockGroupService.getGroupByName = jest
        .fn()
        .mockReturnValueOnce(undefined);
      expect(() => expenseService.addExpense(expense)).toThrowError(
        `グループ： ${expense.groupName} が存在しません`
      );
    });

    it('支払い者がメンバーの中にいない場合はエラーが発生する', () => {
      mockGroupService.getGroupByName = jest.fn().mockReturnValueOnce(group);
      const nonMemberExpense: Expense = {
        ...expense,
        payer: '太郎',
      };
      expect(() => expenseService.addExpense(nonMemberExpense)).toThrowError(
        '支払い者がメンバーの中にいません'
      );
    });
  });

  // describe('getSettlements', () => {
  //   it('支出から清算リストが作成される', () => {
  //     mockGroupService.getGroupByName = jest.fn().mockReturnValueOnce(group);
  //     mockExpenseRepository.loadExpenses = jest
  //       .fn()
  //       .mockReturnValueOnce([expense]);
  //     const calculateSettlementsMock = jest.fn();
  //     (calculateSettlements as jest.Mock) = calculateSettlementsMock;

  //     expenseService.getSettlements(group.name);
  //     expect(calculateSettlementsMock).toHaveBeenCalledWith(
  //       [expense],
  //       group.members
  //     );
  //   });
  // });

  // describe('getSettlements', () => {
  //   it('グループ内の支出が清算される', () => {
  //     (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(group);
  //     (mockExpenseRepository.loadExpenses as jest.Mock).mockReturnValue([
  //       expense,
  //     ]);
  //     const result = expenseService.getSettlements(group.name);
  //     expect(result).toEqual([{ from: '二郎', to: '一郎', amount: 1000 }]);
  //   });

  //   it('グループが存在しない場合は清算されない', () => {
  //     (mockGroupService.getGroupByName as jest.Mock).mockReturnValue(null);
  //     expect(() =>
  //       expenseService.getSettlements(expense.groupName)
  //     ).toThrowError(`グループ： ${expense.groupName} が存在しません`);
  //   });
  // });
});
