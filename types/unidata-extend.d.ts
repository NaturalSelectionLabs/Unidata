type AccountPlatformSymbols =
    | 'ethereum'
    | 'solana'
    | 'flow'
    | 'arweave'
    | 'rss'
    | 'twitter'
    | 'misskey'
    | 'jike'
    | 'playstation'
    | 'github';

type NetworkSymbols =
    | 'crossbell'
    | 'ethereum'
    | 'polygon'
    | 'bsc'
    | 'arbitrum'
    | 'avalanche'
    | 'fantom'
    | 'gnosis'
    | 'solana'
    | 'flow'
    | 'arweave'
    | 'rss'
    | 'twitter'
    | 'misskey'
    | 'jike'
    | 'playstation'
    | 'github';

type Instance =
    | {
          prefix: 'account';
          identity: string;
          platform: AccountPlatformSymbols;
      }
    | {
          prefix: 'assets' | 'notes';
          identity: string;
          platform: NetworkSymbols;
      };
