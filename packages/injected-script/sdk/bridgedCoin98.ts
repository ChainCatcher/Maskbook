import type { RequestArguments } from 'web3-core'
import type { EthereumProvider } from '../shared'
import { createPromise, sendEvent } from './utils'

/** Interact with the current coin98 provider */
export const bridgedCoin98Provider: EthereumProvider = {
    on(event, callback) {
        if (!bridgedCoin98.has(event)) {
            bridgedCoin98.set(event, new Set())
            sendEvent('coin98BridgeRequestListen', event)
        }
        const map = bridgedCoin98.get(event)!
        map.add(callback)
        return () => void map.delete(callback)
    },
    off(event, callback) {
        const map = bridgedCoin98.get(event)
        if (map) map.delete(callback)
    },
    request<T extends unknown>(data: RequestArguments) {
        return createPromise<T>((id) => sendEvent('coin98BridgeSendRequest', id, data))
    },
    getProperty(key) {
        return createPromise((id) => sendEvent('coin98BridgePrimitiveAccess', id, key))
    },
    untilAvailable() {
        return createPromise((id) => sendEvent('untilCoin98BridgeOnline', id))
    },
}

const bridgedCoin98 = new Map<string, Set<Function>>()

/** @internal */
export function onCoin98Event(event: string, data: unknown[]) {
    for (const f of bridgedCoin98.get(event) || []) {
        try {
            Reflect.apply(f, null, data)
        } catch {}
    }
    return
}
