import type { ChainId } from '@masknet/web3-shared-evm'
import type { DomainAPI } from '../index.js'

export class ENS_API implements DomainAPI.Provider<ChainId> {
    lookup(name: string, chainId: ChainId): Promise<string | undefined> {
        throw new Error('Method not implemented.')
    }
    reverse(address: string, chainId: ChainId): Promise<string | undefined> {
        throw new Error('Method not implemented.')
    }
}