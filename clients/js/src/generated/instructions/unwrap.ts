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
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { addAccountMeta, addObjectProperty } from '../shared';

// Accounts.
export type UnwrapInstructionAccounts = {
  candyGuard: PublicKey | Pda;
  authority?: Signer;
  candyMachine: PublicKey | Pda;
  candyMachineAuthority?: Signer;
  candyMachineProgram?: PublicKey | Pda;
};

// Data.
export type UnwrapInstructionData = { discriminator: Array<number> };

export type UnwrapInstructionDataArgs = {};

/** @deprecated Use `getUnwrapInstructionDataSerializer()` without any argument instead. */
export function getUnwrapInstructionDataSerializer(
  _context: object
): Serializer<UnwrapInstructionDataArgs, UnwrapInstructionData>;
export function getUnwrapInstructionDataSerializer(): Serializer<
  UnwrapInstructionDataArgs,
  UnwrapInstructionData
>;
export function getUnwrapInstructionDataSerializer(
  _context: object = {}
): Serializer<UnwrapInstructionDataArgs, UnwrapInstructionData> {
  return mapSerializer<UnwrapInstructionDataArgs, any, UnwrapInstructionData>(
    struct<UnwrapInstructionData>(
      [['discriminator', array(u8(), { size: 8 })]],
      { description: 'UnwrapInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [126, 175, 198, 14, 212, 69, 50, 44],
    })
  ) as Serializer<UnwrapInstructionDataArgs, UnwrapInstructionData>;
}

// Instruction.
export function unwrap(
  context: Pick<Context, 'programs' | 'identity'>,
  input: UnwrapInstructionAccounts
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
    candyGuard: [input.candyGuard, false] as const,
    candyMachine: [input.candyMachine, true] as const,
  };
  addObjectProperty(
    resolvedAccounts,
    'authority',
    input.authority
      ? ([input.authority, false] as const)
      : ([context.identity, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'candyMachineAuthority',
    input.candyMachineAuthority
      ? ([input.candyMachineAuthority, false] as const)
      : ([context.identity, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'candyMachineProgram',
    input.candyMachineProgram
      ? ([input.candyMachineProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'mplCandyMachine',
            'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
          ),
          false,
        ] as const)
  );

  addAccountMeta(keys, signers, resolvedAccounts.candyGuard, false);
  addAccountMeta(keys, signers, resolvedAccounts.authority, false);
  addAccountMeta(keys, signers, resolvedAccounts.candyMachine, false);
  addAccountMeta(keys, signers, resolvedAccounts.candyMachineAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.candyMachineProgram, false);

  // Data.
  const data = getUnwrapInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
