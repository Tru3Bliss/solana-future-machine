/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  ACCOUNT_HEADER_SIZE,
  AccountMeta,
  Context,
  Pda,
  PublicKey,
  Serializer,
  Signer,
  WrappedInstruction,
  checkForIsWritableOverride as isWritable,
  mapSerializer,
  publicKey,
} from '@metaplex-foundation/umi';
import { findAddressLookupTablePda } from '../accounts';

// Accounts.
export type CreateLutInstructionAccounts = {
  address?: Pda;
  authority?: Signer;
  payer?: Signer;
  systemProgram?: PublicKey;
};

// Arguments.
export type CreateLutInstructionData = {
  discriminator: number;
  recentSlot: bigint;
  bump: number;
};

export type CreateLutInstructionDataArgs = {
  recentSlot: number | bigint;
  bump: number;
};

export function getCreateLutInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<CreateLutInstructionDataArgs, CreateLutInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    CreateLutInstructionDataArgs,
    CreateLutInstructionData,
    CreateLutInstructionData
  >(
    s.struct<CreateLutInstructionData>(
      [
        ['discriminator', s.u32()],
        ['recentSlot', s.u64()],
        ['bump', s.u8()],
      ],
      { description: 'CreateLutInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 0 } as CreateLutInstructionData)
  ) as Serializer<CreateLutInstructionDataArgs, CreateLutInstructionData>;
}

// Instruction.
export function createLut(
  context: Pick<
    Context,
    'serializer' | 'programs' | 'eddsa' | 'identity' | 'payer'
  >,
  input: CreateLutInstructionAccounts &
    Omit<CreateLutInstructionDataArgs, 'bump'>
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = context.programs.get(
    'splAddressLookupTable'
  ).publicKey;

  // Resolved accounts.
  const authorityAccount = input.authority ?? context.identity;
  const addressAccount =
    input.address ??
    findAddressLookupTablePda(context, {
      authority: publicKey(authorityAccount),
      recentSlot: input.recentSlot,
    });
  const payerAccount = input.payer ?? context.payer;
  const systemProgramAccount = input.systemProgram ?? {
    ...context.programs.get('splSystem').publicKey,
    isWritable: false,
  };

  // Address.
  keys.push({
    pubkey: addressAccount,
    isSigner: false,
    isWritable: isWritable(addressAccount, true),
  });

  // Authority.
  signers.push(authorityAccount);
  keys.push({
    pubkey: authorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(authorityAccount, false),
  });

  // Payer.
  signers.push(payerAccount);
  keys.push({
    pubkey: payerAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(payerAccount, true),
  });

  // System Program.
  keys.push({
    pubkey: systemProgramAccount,
    isSigner: false,
    isWritable: isWritable(systemProgramAccount, false),
  });

  // Data.
  const data = getCreateLutInstructionDataSerializer(context).serialize({
    ...input,
    bump: addressAccount.bump,
  });

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 56 + ACCOUNT_HEADER_SIZE;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
