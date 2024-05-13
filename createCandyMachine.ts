import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
    mplTokenMetadata,
    TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'
import { create } from '@metaplex-foundation/mpl-candy-machine'
import { generateSigner, percentAmount, keypairIdentity, publicKey, some, none } from '@metaplex-foundation/umi'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

import secretKey from './secret0.json'
// Create Umi Instance
const umi = createUmi('https://api.devnet.solana.com')
            .use(mplCandyMachine())
// .use(mplTokenMetadata())

// Create a keypair from your private key
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
// const myKeypairSigner = createSignerFromKeypair(umi, keypair);
// Register it to the Umi client.
umi.use(keypairIdentity(keypair))

const collectionMint = publicKey('6NEQurruefGA5jLtPQKLqRVExu15P1LTdiB9NyptBxJB')


const candyMachineSettings = {
    authority: umi.identity,
    tokenStandard: TokenStandard.NonFungible,
    sellerFeeBasisPoints: percentAmount(10, 2),
    maxEditionSupply: 0, // indicated how many copies one particular nft could have
    isMutable: true,
    collectionMint: collectionMint,
    collectionUpdateAuthority: umi.identity, // since the umi signer and the collection authority is same
    itemsAvailable: 9,
    // you can add more creators and split the earning, make sure the percentage sum equals 100 tho
    creators: [
        {
            address: umi.identity.publicKey,
            verified: false,
            percentageShare: 100,
        }],
    hiddenSettings: none(),
    configLineSettings: some({
        prefixName: 'The fruit number #ID+1$',
        nameLength: 3,
        prefixUri: 'https://github.com/priyanshuveb/solana-nft/blob/main/assets/images/$ID+1$.jpg?raw=true',
        uriLength: 200,
        isSequential: true,
    }),

}

async function main() {
    // Create the Candy Machine.
    const candyMachine = generateSigner(umi) // this will be the mint address of the candy machine
    const tx = await (await create(umi, {
        candyMachine,
        authority: umi.identity.publicKey,
        tokenStandard: TokenStandard.NonFungible,
        sellerFeeBasisPoints: percentAmount(10, 2),
        maxEditionSupply: 0, // indicated how many copies one particular nft could have
        isMutable: true,
        collectionMint: collectionMint,
        collectionUpdateAuthority: umi.identity, // since the umi signer and the collection authority is same
        itemsAvailable: 9,
        // you can add more creators and split the earning, make sure the percentage sum equals 100 tho
        creators: [
            {
                address: umi.identity.publicKey,
                verified: false,
                percentageShare: 100,
            }
        ],
        hiddenSettings: none(),
        configLineSettings: some({
            prefixName: 'The fruit #ID+1$',
            nameLength: 3,
            prefixUri: 'https://github.com/priyanshuveb/solana-nft/blob/main/assets/images/$ID+1$.jpg?raw=true',
            uriLength: 100,
            isSequential: true,
        }),
    })).sendAndConfirm(umi)
}

main()