/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Context, PublicKey, Serializer } from '@metaplex-foundation/umi';

/**
 * Guard that requires a specified signer to validate the transaction.
 *
 * List of accounts required:
 *
 * 0. `[signer]` Signer of the transaction.
 */

export type ThirdPartySigner = { signerKey: PublicKey };

export type ThirdPartySignerArgs = ThirdPartySigner;

export function getThirdPartySignerSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<ThirdPartySignerArgs, ThirdPartySigner> {
  const s = context.serializer;
  return s.struct<ThirdPartySigner>([['signerKey', s.publicKey()]], {
    description: 'ThirdPartySigner',
  }) as Serializer<ThirdPartySignerArgs, ThirdPartySigner>;
}
