/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  PublicKey,
  SolAmount,
  mapAmountSerializer,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  publicKey as publicKeySerializer,
  struct,
  u64,
} from '@metaplex-foundation/umi/serializers';

/**
 * Guard that charges an amount in SOL (lamports) for the mint.
 *
 * List of accounts required:
 *
 * 0. `[]` Account to receive the funds.
 */

export type SolPayment = { lamports: SolAmount; destination: PublicKey };

export type SolPaymentArgs = SolPayment;

/** @deprecated Use `getSolPaymentSerializer()` without any argument instead. */
export function getSolPaymentSerializer(
  _context: object
): Serializer<SolPaymentArgs, SolPayment>;
export function getSolPaymentSerializer(): Serializer<
  SolPaymentArgs,
  SolPayment
>;
export function getSolPaymentSerializer(
  _context: object = {}
): Serializer<SolPaymentArgs, SolPayment> {
  return struct<SolPayment>(
    [
      ['lamports', mapAmountSerializer(u64(), 'SOL', 9)],
      ['destination', publicKeySerializer()],
    ],
    { description: 'SolPayment' }
  ) as Serializer<SolPaymentArgs, SolPayment>;
}
