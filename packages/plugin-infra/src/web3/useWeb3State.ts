import { useCurrentWeb3NetworkPluginID } from './Context'
import { useActivatedPluginWeb3State } from '../hooks/useActivatedPluginWeb3State'
import type { NetworkPluginID } from '..'

export function useWeb3State(expectedPluginID?: NetworkPluginID) {
    const pluginID = useCurrentWeb3NetworkPluginID(expectedPluginID)
    return useActivatedPluginWeb3State(pluginID) ?? {}
}
