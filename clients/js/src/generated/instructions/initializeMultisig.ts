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
  PublicKey,
  Serializer,
  Signer,
  WrappedInstruction,
  checkForIsWritableOverride as isWritable,
  mapSerializer,
  publicKey,
} from '@metaplex-foundation/umi';

// Accounts.
export type InitializeMultisigInstructionAccounts = {
  multisig: PublicKey;
  rent?: PublicKey;
};

// Arguments.
export type InitializeMultisigInstructionData = {
  discriminator: number;
  m: number;
};

export type InitializeMultisigInstructionDataArgs = { m: number };

export function getInitializeMultisigInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  InitializeMultisigInstructionDataArgs,
  InitializeMultisigInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    InitializeMultisigInstructionDataArgs,
    InitializeMultisigInstructionData,
    InitializeMultisigInstructionData
  >(
    s.struct<InitializeMultisigInstructionData>(
      [
        ['discriminator', s.u8()],
        ['m', s.u8()],
      ],
      { description: 'InitializeMultisigInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 2 } as InitializeMultisigInstructionData)
  ) as Serializer<
    InitializeMultisigInstructionDataArgs,
    InitializeMultisigInstructionData
  >;
}

// Instruction.
export function initializeMultisig(
  context: Pick<Context, 'serializer' | 'programs'>,
  input: InitializeMultisigInstructionAccounts &
    InitializeMultisigInstructionDataArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = context.programs.get('splToken').publicKey;

  // Resolved accounts.
  const multisigAccount = input.multisig;
  const rentAccount =
    input.rent ?? publicKey('SysvarRent111111111111111111111111111111111');

  // Multisig.
  keys.push({
    pubkey: multisigAccount,
    isSigner: false,
    isWritable: isWritable(multisigAccount, true),
  });

  // Rent.
  keys.push({
    pubkey: rentAccount,
    isSigner: false,
    isWritable: isWritable(rentAccount, false),
  });

  // Data.
  const data =
    getInitializeMultisigInstructionDataSerializer(context).serialize(input);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
