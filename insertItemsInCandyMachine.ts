import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { mplCandyMachine, fetchCandyMachine, addConfigLines } from '@metaplex-foundation/mpl-candy-machine'

import secretKey from './secret0.json'
// Create Umi Instance
const umi = createUmi('https://api.devnet.solana.com')
            .use(mplCandyMachine())
            .use(mplTokenMetadata())

// Create a keypair from your private key
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
// const myKeypairSigner = createSignerFromKeypair(umi, keypair);
// Register it to the Umi client.
umi.use(keypairIdentity(keypair))


async function main() {
    const candyMachine = await fetchCandyMachine(umi, publicKey('4vNDEbTJop7iFnH95GuqspPvVoW2JpawLdapvnD5MLvw'))

    await addConfigLines(umi, {
        candyMachine: candyMachine.publicKey,
        index: candyMachine.itemsLoaded,
        configLines: [
          { name: '1', uri: '1.json' },
        //   { name: '2', uri: '2.json' },
        //   { name: '3', uri: '3.json' },
        ],
      }).sendAndConfirm(umi)
      
}

main()