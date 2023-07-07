import { createInjectHooksRenderer, useActivatedPluginsDashboard } from '@masknet/plugin-infra/dashboard'
import { Appearance } from '@masknet/public-api'
import { PageUIProvider, PersonaContext } from '@masknet/shared'
import { NetworkPluginID, PopupRoutes, languageSettings, queryRemoteI18NBundle } from '@masknet/shared-base'
import { useValueRef } from '@masknet/shared-base-ui'
import { PopupSnackbarProvider } from '@masknet/theme'
import { Web3ContextProvider } from '@masknet/web3-hooks-base'
import { lazy, useEffect, useState, type ReactNode } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useClassicMaskFullPageTheme } from '../../utils/theme/useClassicMaskFullPageTheme.js'
import Services from '../service.js'
import { PopupLayout } from './components/PopupLayout/index.js'
import { NormalHeader } from './components/index.js'
import { PageTitleContext } from './context.js'
import { PopupContext } from './hook/usePopupContext.js'

function usePopupTheme() {
    return useClassicMaskFullPageTheme(Appearance.light, useValueRef(languageSettings))
}

const ConnectWallet = lazy(() => import('./pages/Wallet/ConnectWallet/index.js'))
const VerifyWallet = lazy(() => import('./pages/Personas/VerifyWallet/index.js'))
const Unlock = lazy(() => import('./pages/Wallet/Unlock/index.js'))
const SelectWallet = lazy(() => import('./pages/Wallet/SelectWallet/index.js'))
const SignRequest = lazy(() => import('./pages/Wallet/SignRequest/index.js'))

const PluginRender = createInjectHooksRenderer(useActivatedPluginsDashboard, (x) => x.GlobalInjection)

function PluginRenderDelayed() {
    const [canRenderPlugin, setRenderPlugins] = useState(false)
    useEffect(() => setRenderPlugins(true), [])
    if (!canRenderPlugin) return null
    return <PluginRender />
}

export default function PopupsConnect() {
    const [title, setTitle] = useState('')
    const [extension, setExtension] = useState<ReactNode | undefined>()
    useEffect(() => queryRemoteI18NBundle(Services.Helper.queryRemoteI18NBundle), [])

    return PageUIProvider(
        usePopupTheme,
        <Web3ContextProvider value={{ pluginID: NetworkPluginID.PLUGIN_EVM }}>
            <PopupSnackbarProvider>
                <PopupContext.Provider>
                    <PersonaContext.Provider
                        initialState={{
                            queryOwnedPersonaInformation: Services.Identity.queryOwnedPersonaInformation,
                        }}>
                        <PageTitleContext.Provider value={{ title, setTitle, extension, setExtension }}>
                            <HashRouter>
                                <NormalHeader onClose={() => Services.Helper.removePopupWindow()} />
                                <Routes>
                                    <Route path={PopupRoutes.ConnectWallet} element={frame(<ConnectWallet />)} />
                                    <Route path={PopupRoutes.VerifyWallet} element={frame(<VerifyWallet />)} />
                                    <Route path={PopupRoutes.SelectWallet} element={<SelectWallet />} />
                                    <Route path={PopupRoutes.Unlock} element={<Unlock />} />
                                    <Route path={PopupRoutes.WalletSignRequest} element={<SignRequest />} />
                                </Routes>
                                <PluginRenderDelayed />
                            </HashRouter>
                        </PageTitleContext.Provider>
                    </PersonaContext.Provider>
                </PopupContext.Provider>
            </PopupSnackbarProvider>
        </Web3ContextProvider>,
    )
}

function frame(x: React.ReactNode) {
    return <PopupLayout children={x} />
}
