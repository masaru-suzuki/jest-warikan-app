import { Expense, Settlement } from '../type';
import { calculateSettlements } from './settlements';

describe('calculateSettlements', () => {
  test('支出が正しく精算される', () => {
    const expenses: Expense[] = [
      {
        groupName: 'group1',
        expenseName: 'expense1',
        payer: 'bob',
        amount: 300,
      },
      {
        groupName: 'group1',
        expenseName: 'expense2',
        payer: 'alice',
        amount: 100,
      },
    ];
    const groupMembers = ['bob', 'alice', 'carol'];
    const expectedSettlements: Settlement[] = [
      { from: 'alice', to: 'bob', amount: 34 },
      { from: 'carol', to: 'bob', amount: 133 },
    ];

    const result = calculateSettlements(expenses, groupMembers);
    expect(result).toEqual(expectedSettlements);
  });
});
