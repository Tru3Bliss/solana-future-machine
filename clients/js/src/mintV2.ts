import {
  mergeBytes,
  none,
  Option,
  publicKey,
  WrappedInstruction,
} from '@metaplex-foundation/umi';
import { DefaultGuardSetMintArgs } from './defaultGuards';
import {
  mintV2 as baseMintV2,
  MintV2InstructionAccounts,
} from './generated/instructions/mintV2';
import {
  CandyGuardProgram,
  GuardRepository,
  GuardSetArgs,
  GuardSetMintArgs,
  MintContext,
  parseGuardRemainingAccounts,
  parseMintArgs,
} from './guards';

export { MintV2InstructionAccounts };

export type MintV2InstructionData<MA extends GuardSetMintArgs> = {
  discriminator: Array<number>;
  mintArgs: MA;
  label: Option<string>;
};

export type MintV2InstructionDataArgs<MA extends GuardSetMintArgs> = {
  mintArgs?: Partial<MA>;
  label?: Option<string>;
};

export function mintV2<MA extends GuardSetArgs = DefaultGuardSetMintArgs>(
  context: Parameters<typeof baseMintV2>[0] & {
    guards: GuardRepository;
  },
  input: MintV2InstructionAccounts &
    MintV2InstructionDataArgs<
      MA extends undefined ? DefaultGuardSetMintArgs : MA
    >
): WrappedInstruction {
  const { mintArgs = {}, label = none(), ...rest } = input;
  const program = context.programs.get<CandyGuardProgram>('mplCandyGuard');
  const mintContext: MintContext = {
    minter: input.minter ?? context.identity,
    payer: input.payer ?? context.payer,
    mint: publicKey(input.nftMint),
    candyMachine: input.candyMachine,
    candyGuard: input.candyGuard,
  };
  const { data, remainingAccounts } = parseMintArgs<
    MA extends undefined ? DefaultGuardSetMintArgs : MA
  >(context, program, mintContext, mintArgs);
  const prefix = context.serializer.u32().serialize(data.length);
  const ix = baseMintV2(context, {
    ...rest,
    mintArgs: mergeBytes([prefix, data]),
    label,
  });

  const [keys, signers] = parseGuardRemainingAccounts(remainingAccounts);
  ix.instruction.keys.push(...keys);
  ix.signers.push(...signers);

  return ix;
}
