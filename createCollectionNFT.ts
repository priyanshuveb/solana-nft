import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createSignerFromKeypair, generateSigner, keypairIdentity, percentAmount, publicKey } from '@metaplex-foundation/umi'
import { mplTokenMetadata, createNft, updateV1, fetchMetadataFromSeeds } from '@metaplex-foundation/mpl-token-metadata'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'
import secretKey from './secret0.json'
// Create Umi Instance
const umi = createUmi('https://api.devnet.solana.com')
            .use(mplTokenMetadata())
            .use(mplCandyMachine())

// Create a keypair from your private key
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
// Register it to the Umi client.
umi.use(keypairIdentity(keypair))


async function main() {

    // Create the Collection NFT.
    const collectionUpdateAuthority = myKeypairSigner
    const collectionMint = generateSigner(umi)

    
    const tx = await createNft(umi, {
      mint: collectionMint, // this is the address at which the collection nft program will be deployed
      authority: collectionUpdateAuthority, // could directly use umi.identity
      name: 'Seasonal fruits',
      symbol: 'FRUITS',
      uri: 'https://raw.githubusercontent.com/priyanshuveb/solana-nft/main/assets/info/collection.json',
      sellerFeeBasisPoints: percentAmount(10, 2), // 10%
      isCollection: true,
      isMutable: true,
    }).sendAndConfirm(umi)

    console.log('collection nft created successfully!')
    
    
}

main()
