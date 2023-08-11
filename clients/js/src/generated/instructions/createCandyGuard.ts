/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  AccountMeta,
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  bytes,
  mapSerializer,
  struct,
  u32,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { findCandyGuardPda } from '../../hooked';
import { addAccountMeta, addObjectProperty } from '../shared';

// Accounts.
export type CreateCandyGuardInstructionAccounts = {
  candyGuard?: PublicKey | Pda;
  base: Signer;
  authority?: PublicKey | Pda;
  payer?: Signer;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type CreateCandyGuardInstructionData = {
  discriminator: Array<number>;
  data: Uint8Array;
};

export type CreateCandyGuardInstructionDataArgs = { data: Uint8Array };

/** @deprecated Use `getCreateCandyGuardInstructionDataSerializer()` without any argument instead. */
export function getCreateCandyGuardInstructionDataSerializer(
  _context: object
): Serializer<
  CreateCandyGuardInstructionDataArgs,
  CreateCandyGuardInstructionData
>;
export function getCreateCandyGuardInstructionDataSerializer(): Serializer<
  CreateCandyGuardInstructionDataArgs,
  CreateCandyGuardInstructionData
>;
export function getCreateCandyGuardInstructionDataSerializer(
  _context: object = {}
): Serializer<
  CreateCandyGuardInstructionDataArgs,
  CreateCandyGuardInstructionData
> {
  return mapSerializer<
    CreateCandyGuardInstructionDataArgs,
    any,
    CreateCandyGuardInstructionData
  >(
    struct<CreateCandyGuardInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['data', bytes({ size: u32() })],
      ],
      { description: 'CreateCandyGuardInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
    })
  ) as Serializer<
    CreateCandyGuardInstructionDataArgs,
    CreateCandyGuardInstructionData
  >;
}

// Args.
export type CreateCandyGuardInstructionArgs =
  CreateCandyGuardInstructionDataArgs;

// Instruction.
export function createCandyGuard(
  context: Pick<Context, 'programs' | 'eddsa' | 'identity' | 'payer'>,
  input: CreateCandyGuardInstructionAccounts & CreateCandyGuardInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplCandyGuard',
    'Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    base: [input.base, false] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'candyGuard',
    input.candyGuard
      ? ([input.candyGuard, true] as const)
      : ([
          findCandyGuardPda(context, { base: publicKey(input.base, false) }),
          true,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'authority',
    input.authority
      ? ([input.authority, false] as const)
      : ([context.identity.publicKey, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'payer',
    input.payer
      ? ([input.payer, true] as const)
      : ([context.payer, true] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'systemProgram',
    input.systemProgram
      ? ([input.systemProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splSystem',
            '11111111111111111111111111111111'
          ),
          false,
        ] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.candyGuard, false);
  addAccountMeta(keys, signers, resolvedAccounts.base, false);
  addAccountMeta(keys, signers, resolvedAccounts.authority, false);
  addAccountMeta(keys, signers, resolvedAccounts.payer, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);

  // Data.
  const data =
    getCreateCandyGuardInstructionDataSerializer().serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
