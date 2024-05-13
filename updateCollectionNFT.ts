import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createSignerFromKeypair, keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { mplTokenMetadata, updateV1, fetchMetadataFromSeeds } from '@metaplex-foundation/mpl-token-metadata'
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

    const mint = publicKey('6NEQurruefGA5jLtPQKLqRVExu15P1LTdiB9NyptBxJB') // The address of the collection nft
    const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })

    const tx1 = await updateV1(umi, {
        mint,
        authority: myKeypairSigner,
        data: { ...initialMetadata, name: "No more fruits", symbol: "XYXY"}
    }).sendAndConfirm(umi)

    console.log('collection nft updated successfully');
    
}

main()