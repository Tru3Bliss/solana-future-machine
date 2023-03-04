/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Account,
  Context,
  Pda,
  PublicKey,
  RpcAccount,
  RpcGetAccountOptions,
  RpcGetAccountsOptions,
  Serializer,
  assertAccountExists,
  deserializeAccount,
  gpaBuilder,
  mapSerializer,
} from '@metaplex-foundation/umi';

export type CandyGuard = Account<CandyGuardAccountData>;

export type CandyGuardAccountData = {
  discriminator: Array<number>;
  base: PublicKey;
  bump: number;
  authority: PublicKey;
};

export type CandyGuardAccountDataArgs = {
  base: PublicKey;
  bump: number;
  authority: PublicKey;
};

export function getCandyGuardAccountDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<CandyGuardAccountDataArgs, CandyGuardAccountData> {
  const s = context.serializer;
  return mapSerializer<
    CandyGuardAccountDataArgs,
    CandyGuardAccountData,
    CandyGuardAccountData
  >(
    s.struct<CandyGuardAccountData>(
      [
        ['discriminator', s.array(s.u8(), { size: 8 })],
        ['base', s.publicKey()],
        ['bump', s.u8()],
        ['authority', s.publicKey()],
      ],
      { description: 'CandyGuard' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [95, 25, 33, 117, 164, 206, 9, 250],
      } as CandyGuardAccountData)
  ) as Serializer<CandyGuardAccountDataArgs, CandyGuardAccountData>;
}

export function deserializeCandyGuard(
  context: Pick<Context, 'serializer'>,
  rawAccount: RpcAccount
): CandyGuard {
  return deserializeAccount(
    rawAccount,
    getCandyGuardAccountDataSerializer(context)
  );
}

export async function fetchCandyGuard(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<CandyGuard> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  assertAccountExists(maybeAccount, 'CandyGuard');
  return deserializeCandyGuard(context, maybeAccount);
}

export async function safeFetchCandyGuard(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<CandyGuard | null> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  return maybeAccount.exists
    ? deserializeCandyGuard(context, maybeAccount)
    : null;
}

export async function fetchAllCandyGuard(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<CandyGuard[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'CandyGuard');
    return deserializeCandyGuard(context, maybeAccount);
  });
}

export async function safeFetchAllCandyGuard(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<CandyGuard[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) =>
      deserializeCandyGuard(context, maybeAccount as RpcAccount)
    );
}

export function getCandyGuardGpaBuilder(
  context: Pick<Context, 'rpc' | 'serializer' | 'programs'>
) {
  const s = context.serializer;
  const programId = context.programs.getPublicKey(
    'mplCandyGuard',
    'Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g'
  );
  return gpaBuilder(context, programId)
    .registerFields<{
      discriminator: Array<number>;
      base: PublicKey;
      bump: number;
      authority: PublicKey;
    }>({
      discriminator: [0, s.array(s.u8(), { size: 8 })],
      base: [8, s.publicKey()],
      bump: [40, s.u8()],
      authority: [41, s.publicKey()],
    })
    .deserializeUsing<CandyGuard>((account) =>
      deserializeCandyGuard(context, account)
    )
    .whereField('discriminator', [95, 25, 33, 117, 164, 206, 9, 250]);
}

export function getCandyGuardSize(): number {
  return 73;
}

export function findCandyGuardPda(
  context: Pick<Context, 'eddsa' | 'programs' | 'serializer'>,
  seeds: {
    /** The base address which the Candy Guard PDA derives from */
    base: PublicKey;
  }
): Pda {
  const s = context.serializer;
  const programId = context.programs.getPublicKey(
    'mplCandyGuard',
    'Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g'
  );
  return context.eddsa.findPda(programId, [
    s.string({ size: 'variable' }).serialize('candy_guard'),
    s.publicKey().serialize(seeds.base),
  ]);
}
