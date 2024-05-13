import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { keypairIdentity, publicKey, some } from '@metaplex-foundation/umi'
import { mplCandyMachine, fetchCandyMachine, fetchCandyGuard, updateCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

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
    const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority) // mint authority for candy machine is always with the candy guard program
    
    await updateCandyMachine(umi, {
        candyMachine: candyMachine.publicKey,
        data: {
          ...candyMachine.data,
          symbol: 'EXO',
          configLineSettings: some({
            prefixName: 'The fruit #',
            nameLength: 3,
            prefixUri: 'https://raw.githubusercontent.com/priyanshuveb/solana-nft/main/assets/info/',
            uriLength: 100,
            isSequential: true,
        }),
        },
      }).sendAndConfirm(umi)

      console.log('candy machine updated successfully!');
      

}

main()