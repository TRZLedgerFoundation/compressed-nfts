import { dasApi } from "@trezoaplex-foundation/digital-asset-standard-api";
import { mplBubblegum } from "@trezoaplex-foundation/mpl-bubblegum";
import { createNft } from "@trezoaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@trezoaplex-foundation/umi";
import { createUmi } from "@trezoaplex-foundation/umi-bundle-defaults";
import {
  getExplorerLink,
  getKeypairFromFile,
} from "@trezoa-developers/helpers";
import { clusterApiUrl } from "@trezoa/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));

// load keypair from local file system
// See https://github.com/trezoa-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const localKeypair = await getKeypairFromFile();

// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// load the MPL Bubblegum program, dasApi plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());

const collectionMint = generateSigner(umi);

const transaction = createNft(umi, {
  mint: collectionMint,
  name: `My Collection`,
  uri: "https://raw.githubusercontent.com/trezoa-developers/professional-education/main/labs/sample-nft-collection-offchain-data.json",
  sellerFeeBasisPoints: percentAmount(0),
  isCollection: true, // mint as collection NFT
});

const result = await transaction.sendAndConfirm(umi);

console.log(
  `🖼️ 🖼️ 🖼️ Made NFT collection! See ${getExplorerLink(
    "transaction",
    result.signature.toString(),
    "devnet"
  )}`
);
