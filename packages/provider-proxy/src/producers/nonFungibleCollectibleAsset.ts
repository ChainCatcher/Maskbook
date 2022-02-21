import { getOpenSeaNFTList, getRaribleNFTList, getNFTScanNFTs, getAlchemyNFTList } from '@masknet/web3-providers'
import type { ERC721TokenDetailed } from '@masknet/web3-shared-evm'
import type { ProducerArgBase, ProducerKeyFunction, ProducerPushFunction, RPCMethodRegistrationValue } from '../types'
import { collectAllPageData } from '../helper/request'
import { Web3Plugin, PluginId } from '@masknet/plugin-infra'

export interface NonFungibleTokenAssetArgs extends ProducerArgBase {
    address: string
    network?: Web3Plugin.NetworkDescriptor | null
}

const nonFungibleCollectibleAsset = async (
    push: ProducerPushFunction<ERC721TokenDetailed>,
    getKeys: ProducerKeyFunction,
    args: NonFungibleTokenAssetArgs,
): Promise<void> => {
    const { address, network } = args
    const size = 50
    const openSeaApiKey = await getKeys('opensea')

    // Alchemy api is used for polygon and flow network.
    if (network) {
        await collectAllPageData<ERC721TokenDetailed>(
            async (page) => {
                const r = (await getAlchemyNFTList(address, network, page, size)) as {
                    data: ERC721TokenDetailed[]
                    hasNextPage: boolean
                }
                return r
            },
            size,
            push,
        )
    }

    if (network && network.ID !== `${PluginId.EVM}_ethereum`) return

    // These api below only support evm mainnet
    try {
        await collectAllPageData<ERC721TokenDetailed>(
            (page) => getOpenSeaNFTList(openSeaApiKey, address, page, size),
            size,
            push,
        )
    } finally {
        try {
            await collectAllPageData<ERC721TokenDetailed>(
                (page, pageInfo) => getRaribleNFTList(openSeaApiKey, address, page, size, pageInfo),
                size,
                push,
            )
        } finally {
            await collectAllPageData<ERC721TokenDetailed>(
                (page) => getNFTScanNFTs(address, 'erc721', page, size),
                size,
                push,
            )
            await collectAllPageData<ERC721TokenDetailed>(
                (page) => getNFTScanNFTs(address, 'erc1155', page, size),
                size,
                push,
            )
        }
    }
}

const producer: RPCMethodRegistrationValue<ERC721TokenDetailed, NonFungibleTokenAssetArgs> = {
    method: 'mask.fetchNonFungibleCollectibleAsset',
    producer: nonFungibleCollectibleAsset,
    distinctBy: (item) =>
        `${item.tokenId.toLowerCase()}_${item.contractDetailed.address.toLowerCase()}_${item.contractDetailed.chainId}`,
}

export default producer
