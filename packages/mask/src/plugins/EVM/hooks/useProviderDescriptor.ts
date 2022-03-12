import { useProviderType } from '@masknet/web3-shared-evm'
import { PLUGIN_PROVIDERS } from '../constants'

export function useProviderDescriptor() {
    const providerType = useProviderType()
    return PLUGIN_PROVIDERS.find((x) => x.type === providerType) ?? null
}
