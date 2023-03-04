/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  MetadataDelegateRole,
  TokenStandard,
  TokenStandardArgs,
  findMetadataDelegateRecordPda,
  findMetadataPda,
  getTokenStandardSerializer,
} from '@metaplex-foundation/mpl-token-metadata';
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
import { findCandyMachineAuthorityPda } from '../../hooked';

// Accounts.
export type SetTokenStandardInstructionAccounts = {
  candyMachine: PublicKey;
  authority?: Signer;
  authorityPda?: PublicKey;
  payer?: Signer;
  collectionDelegateRecord?: PublicKey;
  collectionMint: PublicKey;
  collectionMetadata?: PublicKey;
  collectionAuthorityRecord?: PublicKey;
  collectionUpdateAuthority: Signer;
  tokenMetadataProgram?: PublicKey;
  systemProgram?: PublicKey;
  sysvarInstructions?: PublicKey;
  authorizationRulesProgram?: PublicKey;
  authorizationRules?: PublicKey;
};

// Arguments.
export type SetTokenStandardInstructionData = {
  discriminator: Array<number>;
  tokenStandard: TokenStandard;
};

export type SetTokenStandardInstructionDataArgs = {
  tokenStandard: TokenStandardArgs;
};

export function getSetTokenStandardInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  SetTokenStandardInstructionDataArgs,
  SetTokenStandardInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    SetTokenStandardInstructionDataArgs,
    SetTokenStandardInstructionData,
    SetTokenStandardInstructionData
  >(
    s.struct<SetTokenStandardInstructionData>(
      [
        ['discriminator', s.array(s.u8(), { size: 8 })],
        ['tokenStandard', getTokenStandardSerializer(context)],
      ],
      { description: 'SetTokenStandardInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [147, 212, 106, 195, 30, 170, 209, 128],
      } as SetTokenStandardInstructionData)
  ) as Serializer<
    SetTokenStandardInstructionDataArgs,
    SetTokenStandardInstructionData
  >;
}

// Instruction.
export function setTokenStandard(
  context: Pick<
    Context,
    'serializer' | 'programs' | 'eddsa' | 'identity' | 'payer'
  >,
  input: SetTokenStandardInstructionAccounts &
    SetTokenStandardInstructionDataArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplCandyMachineCore',
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
  );

  // Resolved accounts.
  const candyMachineAccount = input.candyMachine;
  const authorityAccount = input.authority ?? context.identity;
  const authorityPdaAccount =
    input.authorityPda ??
    findCandyMachineAuthorityPda(context, {
      candyMachine: publicKey(candyMachineAccount),
    });
  const payerAccount = input.payer ?? context.payer;
  const collectionMintAccount = input.collectionMint;
  const collectionUpdateAuthorityAccount = input.collectionUpdateAuthority;
  const collectionDelegateRecordAccount =
    input.collectionDelegateRecord ??
    findMetadataDelegateRecordPda(context, {
      mint: publicKey(collectionMintAccount),
      delegateRole: MetadataDelegateRole.Collection,
      updateAuthority: publicKey(collectionUpdateAuthorityAccount),
      delegate: publicKey(authorityPdaAccount),
    });
  const collectionMetadataAccount =
    input.collectionMetadata ??
    findMetadataPda(context, { mint: publicKey(collectionMintAccount) });
  const collectionAuthorityRecordAccount = input.collectionAuthorityRecord;
  const tokenMetadataProgramAccount = input.tokenMetadataProgram ?? {
    ...context.programs.getPublicKey(
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    ),
    isWritable: false,
  };
  const systemProgramAccount = input.systemProgram ?? {
    ...context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };
  const sysvarInstructionsAccount =
    input.sysvarInstructions ??
    publicKey('Sysvar1nstructions1111111111111111111111111');
  const authorizationRulesProgramAccount = input.authorizationRulesProgram;
  const authorizationRulesAccount = input.authorizationRules;

  // Candy Machine.
  keys.push({
    pubkey: candyMachineAccount,
    isSigner: false,
    isWritable: isWritable(candyMachineAccount, true),
  });

  // Authority.
  signers.push(authorityAccount);
  keys.push({
    pubkey: authorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(authorityAccount, false),
  });

  // Authority Pda.
  keys.push({
    pubkey: authorityPdaAccount,
    isSigner: false,
    isWritable: isWritable(authorityPdaAccount, true),
  });

  // Payer.
  signers.push(payerAccount);
  keys.push({
    pubkey: payerAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(payerAccount, false),
  });

  // Collection Delegate Record.
  keys.push({
    pubkey: collectionDelegateRecordAccount,
    isSigner: false,
    isWritable: isWritable(collectionDelegateRecordAccount, true),
  });

  // Collection Mint.
  keys.push({
    pubkey: collectionMintAccount,
    isSigner: false,
    isWritable: isWritable(collectionMintAccount, false),
  });

  // Collection Metadata.
  keys.push({
    pubkey: collectionMetadataAccount,
    isSigner: false,
    isWritable: isWritable(collectionMetadataAccount, true),
  });

  // Collection Authority Record (optional).
  if (collectionAuthorityRecordAccount) {
    keys.push({
      pubkey: collectionAuthorityRecordAccount,
      isSigner: false,
      isWritable: isWritable(collectionAuthorityRecordAccount, true),
    });
  }

  // Collection Update Authority.
  signers.push(collectionUpdateAuthorityAccount);
  keys.push({
    pubkey: collectionUpdateAuthorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(collectionUpdateAuthorityAccount, false),
  });

  // Token Metadata Program.
  keys.push({
    pubkey: tokenMetadataProgramAccount,
    isSigner: false,
    isWritable: isWritable(tokenMetadataProgramAccount, false),
  });

  // System Program.
  keys.push({
    pubkey: systemProgramAccount,
    isSigner: false,
    isWritable: isWritable(systemProgramAccount, false),
  });

  // Sysvar Instructions.
  keys.push({
    pubkey: sysvarInstructionsAccount,
    isSigner: false,
    isWritable: isWritable(sysvarInstructionsAccount, false),
  });

  // Authorization Rules Program (optional).
  if (authorizationRulesProgramAccount) {
    keys.push({
      pubkey: authorizationRulesProgramAccount,
      isSigner: false,
      isWritable: isWritable(authorizationRulesProgramAccount, false),
    });
  }

  // Authorization Rules (optional).
  if (authorizationRulesAccount) {
    keys.push({
      pubkey: authorizationRulesAccount,
      isSigner: false,
      isWritable: isWritable(authorizationRulesAccount, false),
    });
  }

  // Data.
  const data =
    getSetTokenStandardInstructionDataSerializer(context).serialize(input);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
