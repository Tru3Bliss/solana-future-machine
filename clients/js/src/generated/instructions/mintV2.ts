/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-essentials';
import {
  MetadataDelegateRole,
  findMasterEditionPda,
  findMetadataDelegateRecordPda,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  AccountMeta,
  Context,
  Option,
  PublicKey,
  Serializer,
  Signer,
  TransactionBuilder,
  isSigner,
  mapSerializer,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { findCandyGuardPda, findCandyMachineAuthorityPda } from '../../hooked';
import { addObjectProperty, isWritable } from '../shared';

// Accounts.
export type MintV2InstructionAccounts = {
  candyGuard?: PublicKey;
  candyMachineProgram?: PublicKey;
  candyMachine: PublicKey;
  candyMachineAuthorityPda?: PublicKey;
  payer?: Signer;
  minter?: Signer;
  nftMint: PublicKey | Signer;
  nftMintAuthority?: Signer;
  nftMetadata?: PublicKey;
  nftMasterEdition?: PublicKey;
  token?: PublicKey;
  tokenRecord?: PublicKey;
  collectionDelegateRecord?: PublicKey;
  collectionMint: PublicKey;
  collectionMetadata?: PublicKey;
  collectionMasterEdition?: PublicKey;
  collectionUpdateAuthority: PublicKey;
  tokenMetadataProgram?: PublicKey;
  splTokenProgram?: PublicKey;
  splAtaProgram?: PublicKey;
  systemProgram?: PublicKey;
  sysvarInstructions?: PublicKey;
  recentSlothashes?: PublicKey;
  authorizationRulesProgram?: PublicKey;
  authorizationRules?: PublicKey;
};

// Data.
export type MintV2InstructionData = {
  discriminator: Array<number>;
  mintArgs: Uint8Array;
  group: Option<string>;
};

export type MintV2InstructionDataArgs = {
  mintArgs: Uint8Array;
  group: Option<string>;
};

export function getMintV2InstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<MintV2InstructionDataArgs, MintV2InstructionData> {
  const s = context.serializer;
  return mapSerializer<MintV2InstructionDataArgs, any, MintV2InstructionData>(
    s.struct<MintV2InstructionData>(
      [
        ['discriminator', s.array(s.u8(), { size: 8 })],
        ['mintArgs', s.bytes()],
        ['group', s.option(s.string())],
      ],
      { description: 'MintV2InstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [120, 121, 23, 146, 173, 110, 199, 205],
    })
  ) as Serializer<MintV2InstructionDataArgs, MintV2InstructionData>;
}

// Args.
export type MintV2InstructionArgs = MintV2InstructionDataArgs;

// Instruction.
export function mintV2(
  context: Pick<
    Context,
    'serializer' | 'programs' | 'eddsa' | 'identity' | 'payer'
  >,
  input: MintV2InstructionAccounts & MintV2InstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = {
    ...context.programs.getPublicKey(
      'mplCandyGuard',
      'Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g'
    ),
    isWritable: false,
  };

  // Resolved inputs.
  const resolvingAccounts = {};
  const resolvingArgs = {};
  addObjectProperty(
    resolvingAccounts,
    'candyGuard',
    input.candyGuard ??
      findCandyGuardPda(context, { base: publicKey(input.candyMachine) })
  );
  addObjectProperty(
    resolvingAccounts,
    'candyMachineProgram',
    input.candyMachineProgram ?? {
      ...context.programs.getPublicKey(
        'mplCandyMachine',
        'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
      ),
      isWritable: false,
    }
  );
  addObjectProperty(
    resolvingAccounts,
    'candyMachineAuthorityPda',
    input.candyMachineAuthorityPda ??
      findCandyMachineAuthorityPda(context, {
        candyMachine: publicKey(input.candyMachine),
      })
  );
  addObjectProperty(resolvingAccounts, 'payer', input.payer ?? context.payer);
  addObjectProperty(
    resolvingAccounts,
    'minter',
    input.minter ?? context.identity
  );
  addObjectProperty(
    resolvingAccounts,
    'nftMintAuthority',
    input.nftMintAuthority ?? context.identity
  );
  addObjectProperty(
    resolvingAccounts,
    'nftMetadata',
    input.nftMetadata ??
      findMetadataPda(context, { mint: publicKey(input.nftMint) })
  );
  addObjectProperty(
    resolvingAccounts,
    'nftMasterEdition',
    input.nftMasterEdition ??
      findMasterEditionPda(context, { mint: publicKey(input.nftMint) })
  );
  addObjectProperty(
    resolvingAccounts,
    'token',
    input.token ??
      findAssociatedTokenPda(context, {
        mint: publicKey(input.nftMint),
        owner: publicKey(resolvingAccounts.minter),
      })
  );
  addObjectProperty(
    resolvingAccounts,
    'tokenRecord',
    input.tokenRecord ?? programId
  );
  addObjectProperty(
    resolvingAccounts,
    'collectionDelegateRecord',
    input.collectionDelegateRecord ??
      findMetadataDelegateRecordPda(context, {
        mint: publicKey(input.collectionMint),
        delegateRole: MetadataDelegateRole.Collection,
        updateAuthority: publicKey(input.collectionUpdateAuthority),
        delegate: publicKey(resolvingAccounts.candyMachineAuthorityPda),
      })
  );
  addObjectProperty(
    resolvingAccounts,
    'collectionMetadata',
    input.collectionMetadata ??
      findMetadataPda(context, { mint: publicKey(input.collectionMint) })
  );
  addObjectProperty(
    resolvingAccounts,
    'collectionMasterEdition',
    input.collectionMasterEdition ??
      findMasterEditionPda(context, { mint: publicKey(input.collectionMint) })
  );
  addObjectProperty(
    resolvingAccounts,
    'tokenMetadataProgram',
    input.tokenMetadataProgram ?? {
      ...context.programs.getPublicKey(
        'mplTokenMetadata',
        'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
      ),
      isWritable: false,
    }
  );
  addObjectProperty(
    resolvingAccounts,
    'splTokenProgram',
    input.splTokenProgram ?? {
      ...context.programs.getPublicKey(
        'splToken',
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      ),
      isWritable: false,
    }
  );
  addObjectProperty(
    resolvingAccounts,
    'splAtaProgram',
    input.splAtaProgram ?? {
      ...context.programs.getPublicKey(
        'splAssociatedToken',
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
      ),
      isWritable: false,
    }
  );
  addObjectProperty(
    resolvingAccounts,
    'systemProgram',
    input.systemProgram ?? {
      ...context.programs.getPublicKey(
        'splSystem',
        '11111111111111111111111111111111'
      ),
      isWritable: false,
    }
  );
  addObjectProperty(
    resolvingAccounts,
    'sysvarInstructions',
    input.sysvarInstructions ??
      publicKey('Sysvar1nstructions1111111111111111111111111')
  );
  addObjectProperty(
    resolvingAccounts,
    'recentSlothashes',
    input.recentSlothashes ??
      publicKey('SysvarS1otHashes111111111111111111111111111')
  );
  addObjectProperty(
    resolvingAccounts,
    'authorizationRulesProgram',
    input.authorizationRulesProgram ?? programId
  );
  addObjectProperty(
    resolvingAccounts,
    'authorizationRules',
    input.authorizationRules ?? programId
  );
  const resolvedAccounts = { ...input, ...resolvingAccounts };
  const resolvedArgs = { ...input, ...resolvingArgs };

  // Candy Guard.
  keys.push({
    pubkey: resolvedAccounts.candyGuard,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.candyGuard, false),
  });

  // Candy Machine Program.
  keys.push({
    pubkey: resolvedAccounts.candyMachineProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.candyMachineProgram, false),
  });

  // Candy Machine.
  keys.push({
    pubkey: resolvedAccounts.candyMachine,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.candyMachine, true),
  });

  // Candy Machine Authority Pda.
  keys.push({
    pubkey: resolvedAccounts.candyMachineAuthorityPda,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.candyMachineAuthorityPda, true),
  });

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, true),
  });

  // Minter.
  signers.push(resolvedAccounts.minter);
  keys.push({
    pubkey: resolvedAccounts.minter.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.minter, true),
  });

  // Nft Mint.
  if (isSigner(resolvedAccounts.nftMint)) {
    signers.push(resolvedAccounts.nftMint);
  }
  keys.push({
    pubkey: publicKey(resolvedAccounts.nftMint),
    isSigner: isSigner(resolvedAccounts.nftMint),
    isWritable: isWritable(resolvedAccounts.nftMint, true),
  });

  // Nft Mint Authority.
  signers.push(resolvedAccounts.nftMintAuthority);
  keys.push({
    pubkey: resolvedAccounts.nftMintAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.nftMintAuthority, false),
  });

  // Nft Metadata.
  keys.push({
    pubkey: resolvedAccounts.nftMetadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.nftMetadata, true),
  });

  // Nft Master Edition.
  keys.push({
    pubkey: resolvedAccounts.nftMasterEdition,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.nftMasterEdition, true),
  });

  // Token.
  keys.push({
    pubkey: resolvedAccounts.token,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.token, true),
  });

  // Token Record.
  keys.push({
    pubkey: resolvedAccounts.tokenRecord,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.tokenRecord, true),
  });

  // Collection Delegate Record.
  keys.push({
    pubkey: resolvedAccounts.collectionDelegateRecord,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionDelegateRecord, false),
  });

  // Collection Mint.
  keys.push({
    pubkey: resolvedAccounts.collectionMint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionMint, false),
  });

  // Collection Metadata.
  keys.push({
    pubkey: resolvedAccounts.collectionMetadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionMetadata, true),
  });

  // Collection Master Edition.
  keys.push({
    pubkey: resolvedAccounts.collectionMasterEdition,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionMasterEdition, false),
  });

  // Collection Update Authority.
  keys.push({
    pubkey: resolvedAccounts.collectionUpdateAuthority,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionUpdateAuthority, false),
  });

  // Token Metadata Program.
  keys.push({
    pubkey: resolvedAccounts.tokenMetadataProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.tokenMetadataProgram, false),
  });

  // Spl Token Program.
  keys.push({
    pubkey: resolvedAccounts.splTokenProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.splTokenProgram, false),
  });

  // Spl Ata Program.
  keys.push({
    pubkey: resolvedAccounts.splAtaProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.splAtaProgram, false),
  });

  // System Program.
  keys.push({
    pubkey: resolvedAccounts.systemProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.systemProgram, false),
  });

  // Sysvar Instructions.
  keys.push({
    pubkey: resolvedAccounts.sysvarInstructions,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.sysvarInstructions, false),
  });

  // Recent Slothashes.
  keys.push({
    pubkey: resolvedAccounts.recentSlothashes,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.recentSlothashes, false),
  });

  // Authorization Rules Program.
  keys.push({
    pubkey: resolvedAccounts.authorizationRulesProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.authorizationRulesProgram, false),
  });

  // Authorization Rules.
  keys.push({
    pubkey: resolvedAccounts.authorizationRules,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.authorizationRules, false),
  });

  // Data.
  const data =
    getMintV2InstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
