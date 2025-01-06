import React, { FC, HTMLAttributes, useMemo } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  classes: Record<string, string>;
}

// assuming that I have useWalletBalances and usePrices correct return values
const useWalletBalances = (): WalletBalance[] => {
  return [
    { blockchain: 'Osmosis', currency: 'OSMO', amount: 100 },
    { blockchain: 'Ethereum', currency: 'ETH', amount: 10 },
    { blockchain: 'Arbitrum', currency: 'ETH', amount: 10 },
    { blockchain: 'Zilliqa', currency: 'ZIL', amount: 1000 },
    { blockchain: 'Neo', currency: 'NEO', amount: 10 }
  ];
};

const usePrices = (): Record<string, number> => {
  return {
    OSMO: 10,
    ETH: 2000,
    ZIL: 0.1,
    NEO: 100
  };
};

export const WalletPage: FC<Props> = (props: Props) => {
  const { classes, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  /* 
    Inefficient use of useMemo:
    1. Redundant calls to getPriority:
      The function `getPriority` is called multiple times inside both filter and sort. This results in unnecessary repeated calculations.
    2. Inefficient sorting logic:
      Sorting inside `useMemo` can be expensive for large datasets. Sorting should be done efficiently and only when necessary.
    3. Incorrect dependency array:
      The dependency array includes both `balances` and `prices`, but `prices` isn’t used inside the `useMemo` callback.
    4. Unnecessary dependency on prices

    Refactor version:
      Cache the priorities for each blockchain to avoid redundant calls to getPriority.
      Only sort balances with a positive amount to avoid filtering them twice.
      Remove prices from the dependency array since it’s not used inside the `useMemo` callback.
  */

  const sortedBalances = useMemo<WalletBalance[]>(() => {
    const priorityCache = new Map<string, number>();
    const getCachedPriority = (blockchain: string) => {
      if (!priorityCache.has(blockchain)) {
        priorityCache.set(blockchain, getPriority(blockchain));
      }
      return priorityCache.get(blockchain) as number;
    };

    return balances
      .filter(
        (balance) =>
          balance.amount > 0 && getCachedPriority(balance.blockchain) > -99
      )
      .sort(
        (lhs, rhs) =>
          getCachedPriority(rhs.blockchain) - getCachedPriority(lhs.blockchain)
      );
  }, [balances]);

  /* 
    The component maps over sortedBalances twice — once to create formattedBalances and again to create rows.

    Refactor version:
      Combine the two maps into a single map to avoid iterating over the same data twice.
  */
  const formattedBalances = useMemo<FormattedWalletBalance[]>(
    () =>
      sortedBalances.map((balance: WalletBalance) => {
        return {
          ...balance,
          formatted: balance.amount.toFixed()
        };
      }),
    [sortedBalances]
  );

  /* 
    Using `index` as the key can cause issues when the list changes, such as incorrect UI updates or unnecessary re-renders.

    Refactor version:
      Use a unique key for each row to ensure that React can efficiently update the UI.
  */
  const rows = formattedBalances.map((balance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={`${balance.currency}-${balance.blockchain}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
