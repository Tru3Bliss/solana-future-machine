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
  Signer,
  WrappedInstruction,
  checkForIsWritableOverride as isWritable,
} from '@metaplex-foundation/umi';

// Accounts.
export type RecoverNestedAssociatedTokenInstructionAccounts = {
  nestedAssociatedAccountAddress: PublicKey;
  nestedTokenMintAddress: PublicKey;
  destinationAssociatedAccountAddress: PublicKey;
  ownerAssociatedAccountAddress: PublicKey;
  ownerTokenMintAddress: PublicKey;
  walletAddress: Signer;
  tokenProgram?: PublicKey;
};

// Instruction.
export function recoverNestedAssociatedToken(
  context: Pick<Context, 'serializer' | 'programs'>,
  input: RecoverNestedAssociatedTokenInstructionAccounts
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey =
    context.programs.get('splAssociatedToken').publicKey;

  // Resolved accounts.
  const nestedAssociatedAccountAddressAccount =
    input.nestedAssociatedAccountAddress;
  const nestedTokenMintAddressAccount = input.nestedTokenMintAddress;
  const destinationAssociatedAccountAddressAccount =
    input.destinationAssociatedAccountAddress;
  const ownerAssociatedAccountAddressAccount =
    input.ownerAssociatedAccountAddress;
  const ownerTokenMintAddressAccount = input.ownerTokenMintAddress;
  const walletAddressAccount = input.walletAddress;
  const tokenProgramAccount = input.tokenProgram ?? {
    ...context.programs.get('splToken').publicKey,
    isWritable: false,
  };

  // Nested Associated Account Address.
  keys.push({
    pubkey: nestedAssociatedAccountAddressAccount,
    isSigner: false,
    isWritable: isWritable(nestedAssociatedAccountAddressAccount, true),
  });

  // Nested Token Mint Address.
  keys.push({
    pubkey: nestedTokenMintAddressAccount,
    isSigner: false,
    isWritable: isWritable(nestedTokenMintAddressAccount, false),
  });

  // Destination Associated Account Address.
  keys.push({
    pubkey: destinationAssociatedAccountAddressAccount,
    isSigner: false,
    isWritable: isWritable(destinationAssociatedAccountAddressAccount, true),
  });

  // Owner Associated Account Address.
  keys.push({
    pubkey: ownerAssociatedAccountAddressAccount,
    isSigner: false,
    isWritable: isWritable(ownerAssociatedAccountAddressAccount, false),
  });

  // Owner Token Mint Address.
  keys.push({
    pubkey: ownerTokenMintAddressAccount,
    isSigner: false,
    isWritable: isWritable(ownerTokenMintAddressAccount, false),
  });

  // Wallet Address.
  signers.push(walletAddressAccount);
  keys.push({
    pubkey: walletAddressAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(walletAddressAccount, true),
  });

  // Token Program.
  keys.push({
    pubkey: tokenProgramAccount,
    isSigner: false,
    isWritable: isWritable(tokenProgramAccount, false),
  });

  // Data.
  const data = new Uint8Array();

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
