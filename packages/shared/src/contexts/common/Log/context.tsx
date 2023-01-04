import type { EnhanceableSite } from '@masknet/shared-base'
import { createContext, useContext, useMemo } from 'react'
import type { LogHubBase } from '@masknet/web3-providers/types'
import { LogHub, LogPlatform } from '@masknet/web3-providers'

interface LoggerContext {
    logger?: LogHubBase
}

const LoggerContext = createContext<LoggerContext>(null!)
LoggerContext.displayName = 'LoggerContext'

interface LoggerContextProvider {
    platform: LogPlatform | EnhanceableSite
    enable: boolean
}

export function PluginLoggerContextProvider({ children, value }: React.ProviderProps<LoggerContext>) {
    return <LoggerContext.Provider value={{ logger: value.logger }}>{children}</LoggerContext.Provider>
}

export function LoggerContextProvider({ value, children }: React.ProviderProps<LoggerContextProvider>) {
    const logger = useMemo(() => {
        if (!value.enable) return
        return new LogHub(value.platform)
    }, [value.platform, value.enable])

    return <LoggerContext.Provider value={{ logger }}>{children}</LoggerContext.Provider>
}

export function useLoggerContext() {
    return useContext(LoggerContext)
}
