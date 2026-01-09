import { dasApi } from "@trezoaplex-foundation/digital-asset-standard-api";
import { mplBubblegum } from "@trezoaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  publicKey as UMIPublicKey,
} from "@trezoaplex-foundation/umi";
import { createUmi } from "@trezoaplex-foundation/umi-bundle-defaults";
import { getKeypairFromFile } from "@trezoa-developers/helpers";

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY_GOES_HERE"
);

// load keypair from local file system
// See https://github.com/trezoa-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const localKeypair = await getKeypairFromFile();

// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// load the MPL Bubblegum program, dasApi plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());

const assetId = UMIPublicKey("D4A8TYkKE5NzkqBQ4mPybgFbAUDN53fwJ64b8HwEEuUS");

// @ts-ignore
const rpcAsset = await umi.rpc.getAsset(assetId);
console.log(rpcAsset);
