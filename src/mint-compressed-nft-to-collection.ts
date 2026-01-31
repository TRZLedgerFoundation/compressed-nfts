import { dasApi } from "@trezoaplex-foundation/digital-asset-standard-api";
import {
  findLeafAssetIdPda,
  LeafSchema,
  mintToCollectionV1,
  mplBubblegum,
  parseLeafFromMintToCollectionV1Transaction,
} from "@trezoaplex-foundation/tpl-bubblegum";
import {
  keypairIdentity,
  publicKey as UMIPublicKey,
} from "@trezoaplex-foundation/umi";
import { createUmi } from "@trezoaplex-foundation/umi-bundle-defaults";
import { getKeypairFromFile } from "@trezoa-developers/helpers";
import { clusterApiUrl } from "@trezoa/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));

// load keypair from local file system
// See https://github.com/trezoa-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const localKeypair = await getKeypairFromFile();

// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// load the TPL Bubblegum program, dasApi plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());

const merkleTree = UMIPublicKey("ZwzNxXw83PUmWSypXmqRH669gD3hF9rEjHWPpVghr5h");

const collectionMint = UMIPublicKey(
  "D2zi1QQmtZR5fk7wpA1Fmf6hTY2xy8xVMyNgfq6LsKy1"
);

const uintSig = await (
  await mintToCollectionV1(umi, {
    leafOwner: umi.identity.publicKey,
    merkleTree,
    collectionMint,
    metadata: {
      name: "My NFT",
      uri: "https://chocolate-wet-narwhal-846.mypinata.cloud/ipfs/QmeBRVEmASS3pyK9YZDkRUtAham74JBUZQE3WD4u4Hibv9",
      sellerFeeBasisPoints: 0, // 0%
      collection: { key: collectionMint, verified: false },
      creators: [
        {
          address: umi.identity.publicKey,
          verified: false,
          share: 100,
        },
      ],
    },
  }).sendAndConfirm(umi)
).signature;

const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(
  umi,
  uintSig
);
const assetId = findLeafAssetIdPda(umi, {
  merkleTree,
  leafIndex: leaf.nonce,
})[0];

console.log("asset id:", assetId);
console.log("✅ Finished successfully!");
