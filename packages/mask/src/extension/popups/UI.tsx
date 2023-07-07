import { createInjectHooksRenderer, useActivatedPluginsDashboard } from '@masknet/plugin-infra/dashboard'
import { PageUIProvider } from '@masknet/shared'
import {
    NetworkPluginID,
    PopupModalRoutes,
    PopupRoutes as PopupPaths,
    queryRemoteI18NBundle,
} from '@masknet/shared-base'
import { PopupSnackbarProvider } from '@masknet/theme'
import { TelemetryProvider, Web3ContextProvider, useMountReport } from '@masknet/web3-hooks-base'
import { ProviderType } from '@masknet/web3-shared-evm'
import { EventID } from '@masknet/web3-telemetry/types'
import { lazy, memo, useEffect, useMemo, useState, type ReactNode } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import '../../social-network-adaptor/browser-action/index.js'
import { usePopupTheme } from '../../utils/theme/usePopupTheme.js'
import Services from '../service.js'
import { PopupLayout } from './components/PopupLayout/index.js'
import { PageTitleContext } from './context.js'
import { PopupContext } from './hook/usePopupContext.js'
import { ChooseNetworkModal, Modals } from './modals/index.js'
import SwitchWallet from './pages/Wallet/SwitchWallet/index.js'
import { WalletContext } from './pages/Wallet/hooks/useWalletContext.js'
import { wrapModal } from './components/index.js'

const Wallet = lazy(() => import(/* webpackPreload: true */ './pages/Wallet/index.js'))
const Personas = lazy(() => import(/* webpackPreload: true */ './pages/Personas/index.js'))
const SwapPage = lazy(() => import('./pages/Swap/index.js'))
const RequestPermissionPage = lazy(() => import('./RequestPermission/index.js'))
const PermissionAwareRedirect = lazy(() => import('./PermissionAwareRedirect/index.js'))
const ThirdPartyRequestPermission = lazy(() => import('./ThirdPartyRequestPermission/index.js'))

const PluginRender = createInjectHooksRenderer(useActivatedPluginsDashboard, (x) => x.GlobalInjection)

function PluginRenderDelayed() {
    const [canRenderPlugin, setRenderPlugins] = useState(false)
    useEffect(() => setRenderPlugins(true), [])
    if (!canRenderPlugin) return null
    return <PluginRender />
}

const Web3ContextType = { pluginID: NetworkPluginID.PLUGIN_EVM, providerType: ProviderType.MaskWallet }

const PopupRoutes = memo(function PopupRoutes() {
    const location = useLocation()
    const mainLocation = location.state?.mainLocation as Location | undefined
    return (
        <WalletContext.Provider>
            <Routes location={mainLocation || location}>
                <Route path="/" element={<PopupLayout />}>
                    <Route path={PopupPaths.Personas + '/*'} element={<Personas />} />
                    <Route path={PopupPaths.Wallet + '/*'} element={<Wallet />} />
                </Route>
                <Route path={PopupPaths.Swap} element={<SwapPage />} />
                <Route path={PopupPaths.RequestPermission} element={<RequestPermissionPage />} />
                <Route path={PopupPaths.PermissionAwareRedirect} element={<PermissionAwareRedirect />} />
                <Route path={PopupPaths.ThirdPartyRequestPermission} element={<ThirdPartyRequestPermission />} />
                <Route path="*" element={<Navigate replace to={PopupPaths.Personas} />} />
            </Routes>
            {mainLocation ? (
                <Routes>
                    <Route path={PopupModalRoutes.ChooseNetwork} element={wrapModal(<ChooseNetworkModal />)} />
                    <Route path={PopupModalRoutes.SwitchWallet} element={wrapModal(<SwitchWallet />)} />
                </Routes>
            ) : null}
        </WalletContext.Provider>
    )
})

export default function Popups() {
    const [title, setTitle] = useState('')
    const [extension, setExtension] = useState<ReactNode>()
    const titleContext = useMemo(() => ({ title, setTitle, extension, setExtension }), [title, extension])

    useEffect(() => queryRemoteI18NBundle(Services.Helper.queryRemoteI18NBundle), [])
    useMountReport(EventID.AccessPopups)

    return PageUIProvider(
        usePopupTheme,
        <PopupSnackbarProvider>
            <Web3ContextProvider value={Web3ContextType}>
                <TelemetryProvider>
                    <PopupContext.Provider>
                        <PageTitleContext.Provider value={titleContext}>
                            <HashRouter>
                                <PopupRoutes />
                                <Modals />
                                {/* TODO: Should only load plugins when the page is plugin-aware. */}
                                <PluginRenderDelayed />
                            </HashRouter>
                        </PageTitleContext.Provider>
                    </PopupContext.Provider>
                </TelemetryProvider>
            </Web3ContextProvider>
        </PopupSnackbarProvider>,
        null,
    )
}
