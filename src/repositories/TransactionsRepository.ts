import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const trasactions = await this.find();

    const { income, outcome } = trasactions.reduce(
      (accumulator, trasaction) => {
        switch (trasaction.type) {
          case 'income':
            accumulator.income += Number(trasaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(trasaction.value);
            break;

          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
