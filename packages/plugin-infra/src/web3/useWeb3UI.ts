import { useCurrentWeb3NetworkPluginID } from './Context'
import { useActivatedPluginWeb3UI } from '../hooks/useActivatedPluginWeb3UI'
import type { NetworkPluginID } from '..'

export function useWeb3UI(expectedPluginID?: NetworkPluginID) {
    const pluginID = useCurrentWeb3NetworkPluginID(expectedPluginID)
    return useActivatedPluginWeb3UI(pluginID) ?? {}
}
