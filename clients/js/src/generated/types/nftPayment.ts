/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { PublicKey } from '@metaplex-foundation/umi';
import {
  Serializer,
  publicKey as publicKeySerializer,
  struct,
} from '@metaplex-foundation/umi/serializers';

/**
 * Guard that charges another NFT (token) from a specific collection as payment
 * for the mint.
 *
 * List of accounts required:
 *
 * 0. `[writeable]` Token account of the NFT.
 * 1. `[writeable]` Metadata account of the NFT.
 * 2. `[]` Mint account of the NFT.
 * 3. `[]` Account to receive the NFT.
 * 4. `[writeable]` Destination PDA key (seeds [destination pubkey, token program id, nft mint pubkey]).
 * 5. `[]` spl-associate-token program ID.
 * 6. `[]` Master edition (pNFT)
 * 7. `[writable]` Owner token record (pNFT)
 * 8. `[writable]` Destination token record (pNFT)
 * 9. `[]` Token Authorization Rules program (pNFT)
 * 10. `[]` Token Authorization Rules account (pNFT)
 */

export type NftPayment = {
  requiredCollection: PublicKey;
  destination: PublicKey;
};

export type NftPaymentArgs = NftPayment;

/** @deprecated Use `getNftPaymentSerializer()` without any argument instead. */
export function getNftPaymentSerializer(
  _context: object
): Serializer<NftPaymentArgs, NftPayment>;
export function getNftPaymentSerializer(): Serializer<
  NftPaymentArgs,
  NftPayment
>;
export function getNftPaymentSerializer(
  _context: object = {}
): Serializer<NftPaymentArgs, NftPayment> {
  return struct<NftPayment>(
    [
      ['requiredCollection', publicKeySerializer()],
      ['destination', publicKeySerializer()],
    ],
    { description: 'NftPayment' }
  ) as Serializer<NftPaymentArgs, NftPayment>;
}
