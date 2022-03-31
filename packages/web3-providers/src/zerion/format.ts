import BigNumber from 'bignumber.js'
import { leftShift, multipliedBy } from '@masknet/web3-shared-base'
import { ChainId, getTokenConstants } from '@masknet/web3-shared-evm'
import { TokenType, Web3Plugin } from '@masknet/plugin-infra'
import {
    ZerionAddressAsset,
    ZerionAddressCovalentAsset,
    ZerionAsset,
    ZerionCovalentAsset,
    ZerionRBDTransactionType,
    ZerionTransactionItem,
    ZerionTransactionStatus,
} from './type'

export function formatAssets(
    chainId: ChainId,
    data: ZerionAddressAsset[] | ZerionAddressCovalentAsset[],
): Web3Plugin.FungibleAsset[] {
    return data.map(({ asset, quantity }) => {
        const balance = leftShift(quantity, asset.decimals).toNumber()
        const value = (asset as ZerionAsset).price?.value ?? (asset as ZerionCovalentAsset).value ?? 0
        const isNativeToken = (symbol: string) => ['ETH', 'BNB', 'MATIC', 'ARETH', 'AETH'].includes(symbol)
        const address = isNativeToken(asset.symbol) ? getTokenConstants().NATIVE_TOKEN_ADDRESS ?? '' : asset.asset_code

        return {
            id: address,
            chainId,
            balance: quantity,
            price: {
                usd: new BigNumber(value).toString(),
            },
            value: {
                usd: multipliedBy(balance, value).toString(),
            },
            token: {
                id: address,
                type: TokenType.Fungible,
                chainId,
                name: asset.name ?? 'Unknown Token',
                symbol: asset.symbol,
                decimals: asset.decimals,
                address,
                logoURI: asset.icon_url,
            },
            logoURI: asset.icon_url,
        }
    })
}

export function formatTransactions(chainId: ChainId, data: ZerionTransactionItem[]): Web3Plugin.Transaction[] {
    return data
        .filter(({ type }) => type !== ZerionRBDTransactionType.AUTHORIZE)
        .map((transaction) => {
            const ethGasFee = leftShift(transaction.fee?.value ?? 0, 18).toString()
            const usdGasFee = multipliedBy(ethGasFee, transaction.fee?.price ?? 0).toString()

            return {
                id: transaction.hash,
                type: transaction.type,
                filterType: transaction.type,
                from: transaction.address_from ?? '',
                to: transaction.address_to ?? '',
                timestamp: transaction.mined_at,
                status: transaction.status === ZerionTransactionStatus.FAILED ? 0 : 1,
                tokens:
                    transaction.changes?.map(({ asset, direction, value }) => {
                        return {
                            id: asset.asset_code,
                            // TODO: distinguish NFT
                            type: TokenType.Fungible,
                            chainId,
                            name: asset.name,
                            symbol: asset.symbol,
                            address: asset.asset_code,
                            direction,
                            amount: leftShift(value, asset.decimals).toString(),
                            logoURI: asset.icon_url,
                        }
                    }) ?? [],
                fee: {
                    eth: ethGasFee,
                    usd: usdGasFee,
                },
            }
        })
}
