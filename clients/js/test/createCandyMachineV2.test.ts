import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  none,
  percentAmount,
  publicKey,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import test from 'ava';
import {
  AccountVersion,
  CandyMachine,
  createCandyMachineV2,
  Creator,
  fetchCandyMachine,
} from '../src';
import {
  createCollectionNft,
  createUmi,
  defaultCandyMachineData,
} from './_setup';

test('it can create a candy machine using config line settings', async (t) => {
  // Given an existing collection NFT.
  const umi = await createUmi();
  const collectionMint = await createCollectionNft(umi);

  // When we create a new candy machine with config line settings.
  const candyMachine = generateSigner(umi);
  const creator = generateSigner(umi);
  await transactionBuilder(umi)
    .add(
      await createCandyMachineV2(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 100,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          { address: creator.publicKey, verified: false, percentageShare: 100 },
        ],
        configLineSettings: some({
          prefixName: 'My NFT #',
          nameLength: 8,
          prefixUri: 'https://example.com/',
          uriLength: 20,
          isSequential: false,
        }),
      })
    )
    .sendAndConfirm();

  // Then we expect the candy machine account to have the right data.
  const candyMachineAccount = await fetchCandyMachine(
    umi,
    candyMachine.publicKey
  );
  t.like(candyMachineAccount, <CandyMachine>{
    publicKey: publicKey(candyMachine),
    authority: publicKey(umi.identity),
    mintAuthority: publicKey(umi.identity),
    collectionMint: publicKey(collectionMint),
    version: AccountVersion.V2,
    tokenStandard: TokenStandard.NonFungible,
    itemsRedeemed: 0n,
    data: {
      itemsAvailable: 100n,
      symbol: '',
      sellerFeeBasisPoints: percentAmount(1.23),
      maxEditionSupply: 0n,
      isMutable: true,
      creators: [
        {
          address: publicKey(creator),
          verified: false,
          percentageShare: 100,
        },
      ] as Creator[],
      configLineSettings: some({
        prefixName: 'My NFT #',
        nameLength: 8,
        prefixUri: 'https://example.com/',
        uriLength: 20,
        isSequential: false,
      }),
      hiddenSettings: none(),
    },
  });
});

test('it can create a candy machine using hidden settings', async (t) => {
  // Given an existing collection NFT.
  const umi = await createUmi();
  const collectionMint = await createCollectionNft(umi);

  // When we create a new candy machine with hidden settings.
  const candyMachine = generateSigner(umi);
  const creator = generateSigner(umi);
  await transactionBuilder(umi)
    .add(
      await createCandyMachineV2(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 100,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          { address: creator.publicKey, verified: false, percentageShare: 100 },
        ],
        hiddenSettings: some({
          name: 'My NFT #$ID+1$',
          uri: 'https://example.com/$ID+1$.json',
          hash: new Uint8Array(Array(32).fill(42)),
        }),
      })
    )
    .sendAndConfirm();

  // Then we expect the candy machine account to have the right data.
  const candyMachineAccount = await fetchCandyMachine(
    umi,
    candyMachine.publicKey
  );
  t.like(candyMachineAccount, <CandyMachine>{
    publicKey: publicKey(candyMachine),
    authority: publicKey(umi.identity),
    mintAuthority: publicKey(umi.identity),
    collectionMint: publicKey(collectionMint),
    version: AccountVersion.V2,
    tokenStandard: TokenStandard.NonFungible,
    itemsRedeemed: 0n,
    data: {
      itemsAvailable: 100n,
      symbol: '',
      sellerFeeBasisPoints: percentAmount(1.23),
      maxEditionSupply: 0n,
      isMutable: true,
      creators: [
        {
          address: publicKey(creator),
          verified: false,
          percentageShare: 100,
        },
      ] as Creator[],
      configLineSettings: none(),
      hiddenSettings: some({
        name: 'My NFT #$ID+1$',
        uri: 'https://example.com/$ID+1$.json',
        hash: new Uint8Array(Array(32).fill(42)),
      }),
    },
  });
});

test('it cannot create a candy machine without hidden or config line settings', async (t) => {
  // Given an existing collection NFT.
  const umi = await createUmi();
  const collectionMint = (await createCollectionNft(umi)).publicKey;

  // When we try to create a new candy machine without any settings.
  const candyMachine = generateSigner(umi);
  const promise = transactionBuilder(umi)
    .add(
      await createCandyMachineV2(umi, {
        ...defaultCandyMachineData(umi),
        collectionMint,
        candyMachine,
        configLineSettings: none(),
        hiddenSettings: none(),
      })
    )
    .sendAndConfirm();

  // Then we expect a program error.
  await t.throwsAsync(promise, { message: /A raw constraint was violated/ });
});

test('it can create a candy machine of Programmable NFTs', async (t) => {
  // Given an existing collection NFT.
  const umi = await createUmi();
  const collectionMint = (await createCollectionNft(umi)).publicKey;

  // When we create a new candy machine using the Programmable NFTs standard.
  const candyMachine = generateSigner(umi);
  await transactionBuilder(umi)
    .add(
      await createCandyMachineV2(umi, {
        ...defaultCandyMachineData(umi),
        candyMachine,
        collectionMint,
        tokenStandard: TokenStandard.ProgrammableNonFungible,
      })
    )
    .sendAndConfirm();

  // Then we expect the candy machine account to have the right data.
  const candyMachineAccount = await fetchCandyMachine(
    umi,
    candyMachine.publicKey
  );
  t.like(candyMachineAccount, <CandyMachine>{
    publicKey: publicKey(candyMachine),
    version: AccountVersion.V2,
    tokenStandard: TokenStandard.ProgrammableNonFungible,
  });
});

test("it can create a candy machine that's bigger than 10Kb", async (t) => {
  // Given an existing collection NFT.
  const umi = await createUmi();
  const collectionMint = await createCollectionNft(umi);

  // When we create a new candy machine with a large amount of items.
  const candyMachine = generateSigner(umi);
  await transactionBuilder(umi)
    .add(
      await createCandyMachineV2(umi, {
        ...defaultCandyMachineData(umi),
        candyMachine,
        itemsAvailable: 20000,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
      })
    )
    .sendAndConfirm();

  // Then we expect the candy machine account to have been created.
  const candyMachineAccount = await fetchCandyMachine(
    umi,
    candyMachine.publicKey
  );
  t.like(candyMachineAccount, <CandyMachine>{
    publicKey: publicKey(candyMachine),
    itemsRedeemed: 0n,
    data: { itemsAvailable: 20000n },
  });
});
