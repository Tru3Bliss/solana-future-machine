const path = require("path");
const {
  Kinobi,
  RenderJavaScriptVisitor,
  SetNumberWrappersVisitor,
  UpdateAccountsVisitor,
  UpdateInstructionsVisitor,
  UpdateProgramsVisitor,
  SetStructDefaultValuesVisitor,
  TypeNumberNode,
  TypePublicKeyNode,
  TypeBytesNode,
  SetInstructionAccountDefaultValuesVisitor,
  TransformNodesVisitor,
  UnwrapInstructionArgsStructVisitor,
  vScalar,
  vNone,
  AccountNode,
  TypeStructNode,
  TypeStructFieldNode,
  TypeDefinedLinkNode,
  vEnum,
} = require("@metaplex-foundation/kinobi");
const {
  TransformDefinedTypesIntoAccountsVisitor,
} = require("./visitors/TransformDefinedTypesIntoAccountsVisitor.cjs");

// Paths.
const clientDir = path.join(__dirname, "..", "clients");
const idlDir = path.join(__dirname, "..", "idls");

// Instanciate Kinobi.
const kinobi = new Kinobi([
  path.join(idlDir, "candy_machine_core.json"),
  path.join(idlDir, "candy_guard.json"),
]);

// Update programs.
kinobi.update(
  new UpdateProgramsVisitor({
    candyGuard: { name: "mplCandyGuard", prefix: "Cg" },
    candyMachineCore: { name: "mplCandyMachineCore", prefix: "Cm" },
  })
);

// Transform some defined types into accounts.
kinobi.update(
  new TransformDefinedTypesIntoAccountsVisitor([
    "mintCounter",
    "allowListProof",
  ])
);

// Reusable seeds.
const candyGuardSeed = {
  kind: "variable",
  name: "candyGuard",
  description: "The address of the Candy Guard account",
  type: new TypePublicKeyNode(),
};
const candyMachineSeed = {
  kind: "variable",
  name: "candyMachine",
  description: "The address of the Candy Machine account",
  type: new TypePublicKeyNode(),
};
const userSeed = {
  kind: "variable",
  name: "user",
  description: "The address of the wallet trying to mint",
  type: new TypePublicKeyNode(),
};

// Update accounts.
kinobi.update(
  new UpdateAccountsVisitor({
    candyGuard: {
      seeds: [
        { kind: "literal", value: "candy_guard" },
        {
          kind: "variable",
          name: "base",
          description:
            "The base address which the Candy Guard PDA derives from",
          type: new TypePublicKeyNode(),
        },
      ],
    },
    mintCounter: {
      size: 2,
      discriminator: { kind: "size" },
      seeds: [
        { kind: "literal", value: "mint_limit" },
        {
          kind: "variable",
          name: "id",
          description:
            "A unique identifier in the context of a Candy Machine/Candy Guard combo",
          type: new TypeNumberNode("u8"),
        },
        userSeed,
        candyGuardSeed,
        candyMachineSeed,
      ],
    },
    allowListProof: {
      size: 4,
      discriminator: { kind: "size" },
      seeds: [
        { kind: "literal", value: "allow_list" },
        {
          kind: "variable",
          name: "merkleRoot",
          description: "The Merkle Root used when verifying the user",
          type: new TypeBytesNode({ size: { kind: "fixed", bytes: 32 } }),
        },
        userSeed,
        candyGuardSeed,
        candyMachineSeed,
      ],
    },
    freezeEscrow: {
      seeds: [
        { kind: "literal", value: "freeze_escrow" },
        {
          kind: "variable",
          name: "destination",
          description: "The wallet that will eventually receive the funds",
          type: new TypePublicKeyNode(),
        },
        candyGuardSeed,
        candyMachineSeed,
      ],
    },
  })
);

// Update CandyMachine account data.
kinobi.update(
  new TransformNodesVisitor([
    {
      selector: { type: "account", name: "candyMachine" },
      transformer: (node) => {
        const newFields = node.type.fields.map((field) => {
          if (field.name === "tokenStandard") {
            return new TypeStructFieldNode(
              field.metadata,
              new TypeDefinedLinkNode("tokenStandard", {
                dependency: "mplTokenMetadata",
              })
            );
          }
          return field;
        });
        return new AccountNode(
          node.metadata,
          new TypeStructNode(node.type.name, newFields)
        );
      },
    },
  ])
);

// Reusable PDA defaults.
const defaultsToCandyMachineAuthorityPda = (candyMachine = "candyMachine") => ({
  kind: "pda",
  pdaAccount: "candyMachineAuthority",
  dependency: "hooked",
  seeds: { candyMachine: { kind: "account", name: candyMachine } },
});
const defaultsToMetadataPda = (mint = "mint") => ({
  kind: "pda",
  pdaAccount: "metadata",
  dependency: "mplTokenMetadata",
  seeds: { mint: { kind: "account", name: mint } },
});
const defaultsToMasterEditionPda = (mint = "mint") => ({
  kind: "pda",
  pdaAccount: "masterEdition",
  dependency: "mplTokenMetadata",
  seeds: { mint: { kind: "account", name: mint } },
});
const defaultsToCollectionAuthorityRecordPda = (
  mint = "mint",
  collectionAuthority = "collectionAuthority"
) => ({
  kind: "pda",
  pdaAccount: "collectionAuthorityRecord",
  dependency: "mplTokenMetadata",
  seeds: {
    mint: { kind: "account", name: mint },
    collectionAuthority: { kind: "account", name: collectionAuthority },
  },
});
const defaultsToMetadataDelegateRecordPda = (
  role = "Collection",
  mint = "mint",
  updateAuthority = "updateAuthority",
  delegate = "delegate"
) => ({
  kind: "pda",
  pdaAccount: "metadataDelegateRecord",
  dependency: "mplTokenMetadata",
  seeds: {
    mint: { kind: "account", name: mint },
    delegateRole: {
      kind: "value",
      value: vEnum("metadataDelegateRole", role, null, "mplTokenMetadata"),
    },
    updateAuthority: { kind: "account", name: updateAuthority },
    delegate: { kind: "account", name: delegate },
  },
});

// Automatically recognize account default values.
kinobi.update(
  new SetInstructionAccountDefaultValuesVisitor([
    {
      kind: "program",
      account: /^tokenMetadataProgram|mplTokenMetadataProgram$/,
      program: {
        name: "mplTokenMetadata",
        publicKey: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
      },
      ignoreIfOptional: true,
    },
    {
      kind: "program",
      account: /^candyMachineProgram|mplCandyMachineProgram$/,
      program: {
        name: "mplCandyMachine",
        publicKey: "CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR",
      },
      ignoreIfOptional: true,
    },
    {
      kind: "program",
      account: /^candyGuardProgram|mplCandyGuardProgram$/,
      program: {
        name: "mplCandyGuard",
        publicKey: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g",
      },
      ignoreIfOptional: true,
    },
    {
      kind: "publicKey",
      account: /^instructionSysvarAccount$/,
      publicKey: "Sysvar1nstructions1111111111111111111111111",
      ignoreIfOptional: true,
    },
    {
      kind: "publicKey",
      account: /^recentSlothashes$/,
      publicKey: "SysvarS1otHashes111111111111111111111111111",
      ignoreIfOptional: true,
    },
    {
      kind: "identity",
      account: "candyMachineAuthority",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToCandyMachineAuthorityPda(),
      account: "authorityPda",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToCandyMachineAuthorityPda(),
      account: "candyMachineAuthorityPda",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToMetadataPda("collectionMint"),
      account: "collectionMetadata",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToMetadataPda("newCollectionMint"),
      account: "newCollectionMetadata",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToMetadataPda("nftMint"),
      account: "nftMetadata",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToMasterEditionPda("collectionMint"),
      account: "collectionMasterEdition",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToMasterEditionPda("newCollectionMint"),
      account: "newCollectionMasterEdition",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToMasterEditionPda("nftMint"),
      account: "nftMasterEdition",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToCollectionAuthorityRecordPda(
        "collectionMint",
        "authorityPda"
      ),
      account: "collectionAuthorityRecord",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToCollectionAuthorityRecordPda(
        "newCollectionMint",
        "authorityPda"
      ),
      account: "newCollectionAuthorityRecord",
      ignoreIfOptional: true,
    },
    {
      ...defaultsToMetadataDelegateRecordPda(
        "collection",
        "collectionMint",
        "collectionUpdateAuthority",
        "authorityPda"
      ),
      account: "collectionDelegateRecord",
      ignoreIfOptional: true,
    },
  ])
);

// Update instructions.
kinobi.update(
  new UpdateInstructionsVisitor({
    "mplCandyMachineCore.initialize": { name: "initializeCandyMachine" },
    "mplCandyGuard.initialize": { name: "initializeCandyGuard" },
    "mplCandyMachineCore.initializeV2": { name: "initializeV2CandyMachine" },
    "mplCandyMachineCore.mint": { name: "mintFromCandyMachine" },
    "mplCandyMachineCore.mintV2": { name: "mintV2FromCandyMachine" },
    "mplCandyGuard.mint": {
      name: "mint",
      accounts: {
        collectionAuthorityRecord: {
          defaultsTo: defaultsToCollectionAuthorityRecordPda(
            "collectionMint",
            "candyMachineAuthorityPda"
          ),
        },
      },
    },
    "mplCandyGuard.mintV2": { name: "mintV2" },
    "mplCandyMachineCore.SetAuthority": { name: "SetCandyMachineAuthority" },
    "mplCandyGuard.SetAuthority": { name: "SetCandyGuardAuthority" },
    "mplCandyMachineCore.update": { name: "updateCandyMachine" },
    "mplCandyGuard.update": { name: "updateCandyGuard" },
    "mplCandyMachineCore.withdraw": { name: "withdrawCandyMachine" },
    "mplCandyGuard.withdraw": { name: "withdrawCandyGuard" },
  })
);

// Unwrap candyMachineData defined type but only for initialize instructions.
const candyMachineDataNode = kinobi.rootNode.allDefinedTypes.find(
  (type) => type.name === "candyMachineData"
);
kinobi.update(
  new TransformNodesVisitor([
    {
      selector: {
        type: "typeDefinedLink",
        name: "candyMachineData",
        stack: ["initializeCandyMachine"],
      },
      transformer: () => candyMachineDataNode.type,
    },
    {
      selector: {
        type: "typeDefinedLink",
        name: "candyMachineData",
        stack: ["initializeV2CandyMachine"],
      },
      transformer: () => candyMachineDataNode.type,
    },
  ])
);
kinobi.update(new UnwrapInstructionArgsStructVisitor());

const defaultInitialCandyMachineData = {
  symbol: vScalar(""),
  maxSupply: vScalar(0),
  isMutable: vScalar(true),
  configLineSettings: vNone(),
  hiddenSettings: vNone(),
};
kinobi.update(
  new SetStructDefaultValuesVisitor({
    initializeCandyMachineInstructionData: defaultInitialCandyMachineData,
    initializeV2CandyMachineInstructionData: defaultInitialCandyMachineData,
  })
);

// Wrap numbers.
const percentAmount = { kind: "Amount", identifier: "%", decimals: 2 };
kinobi.update(
  new SetNumberWrappersVisitor({
    "candyMachineData.sellerFeeBasisPoints": percentAmount,
    "initializeCandyMachineInstructionData.sellerFeeBasisPoints": percentAmount,
  })
);

// Render JavaScript.
const jsDir = path.join(clientDir, "js", "src", "generated");
kinobi.accept(
  new RenderJavaScriptVisitor(jsDir, {
    prettier: require(path.join(clientDir, "js", ".prettierrc.json")),
    dependencyMap: {
      mplTokenMetadata: "@metaplex-foundation/mpl-token-metadata",
    },
  })
);
