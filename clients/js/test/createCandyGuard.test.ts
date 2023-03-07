import {
  dateTime,
  generateSigner,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import test from 'ava';
import {
  CandyGuard,
  createCandyGuard,
  emptyDefaultGuardSetArgs,
  fetchCandyGuard,
  findCandyGuardPda,
  GuardGroup,
  GuardSet,
} from '../src';
import { createUmi } from './_setup';

test('it can create a candy guard without guards', async (t) => {
  // Given a base address.
  const umi = await createUmi();
  const base = generateSigner(umi);

  // When we create a new candy guard without guards.
  await transactionBuilder(umi)
    .add(createCandyGuard(umi, { base }))
    .sendAndConfirm();

  // Then a new candy guard account was created with the expected data.
  const candyGuard = findCandyGuardPda(umi, { base: base.publicKey });
  const candyGuardAccount = await fetchCandyGuard(umi, candyGuard);
  t.like(candyGuardAccount, <CandyGuard>{
    publicKey: publicKey(candyGuard),
    base: publicKey(base),
    authority: publicKey(umi.identity),
    guards: emptyDefaultGuardSetArgs,
    groups: [] as GuardGroup<GuardSet>[],
  });
});

test('it can create a candy guard with guards', async (t) => {
  // Given a base address.
  const umi = await createUmi();
  const base = generateSigner(umi);

  // When we create a new candy guard with guards.
  const solDestination = generateSigner(umi).publicKey;
  const gatekeeperNetwork = generateSigner(umi).publicKey;
  const tokenMint = generateSigner(umi).publicKey;
  const tokenDestination = generateSigner(umi).publicKey;
  await transactionBuilder(umi)
    .add(
      createCandyGuard(umi, {
        base,
        guards: {
          botTax: some({ lamports: sol(0.001), lastInstruction: true }),
          solPayment: some({ lamports: sol(1.5), destination: solDestination }),
          startDate: some({ date: '2023-03-07T16:13:00.000Z' }),
          endDate: some({ date: '2023-03-08T16:13:00.000Z' }),
          gatekeeper: some({ gatekeeperNetwork, expireOnUse: true }),
          tokenPayment: some({
            amount: 42,
            mint: tokenMint,
            destinationAta: tokenDestination,
          }),
        },
      })
    )
    .sendAndConfirm();

  // Then a new candy guard account was created with the expected data.
  const candyGuard = findCandyGuardPda(umi, { base: base.publicKey });
  const candyGuardAccount = await fetchCandyGuard(umi, candyGuard);
  t.like(candyGuardAccount, <CandyGuard>{
    publicKey: publicKey(candyGuard),
    base: publicKey(base),
    authority: publicKey(umi.identity),
    guards: {
      ...emptyDefaultGuardSetArgs,
      botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      solPayment: some({ lamports: sol(1.5), destination: solDestination }),
      startDate: some({ date: dateTime('2023-03-07T16:13:00.000Z') }),
      endDate: some({ date: dateTime('2023-03-08T16:13:00.000Z') }),
      gatekeeper: some({ gatekeeperNetwork, expireOnUse: true }),
      tokenPayment: some({
        amount: 42n,
        mint: tokenMint,
        destinationAta: tokenDestination,
      }),
    },
    groups: [] as GuardGroup<GuardSet>[],
  });
});
