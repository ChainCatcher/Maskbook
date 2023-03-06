import { useContext, useEffect } from 'react'
import { useCopyToClipboard } from 'react-use'
import { ChainId } from '@masknet/web3-shared-evm'
import { openWindow } from '@masknet/shared-base-ui'
import { resolveNextIDPlatformLink } from '@masknet/web3-shared-base'
import { ScopedDomainsContainer, useWeb3State } from '@masknet/web3-hooks-base'
import { NetworkPluginID } from '@masknet/shared-base'
import { useSnackbarCallback } from '@masknet/shared'
import { Box, Typography, Link, alpha } from '@mui/material'
import { ENSProvider, ENSContext, type SearchResultInspectorProps } from './context.js'
import { SocialAccountList } from './SocialAccountList.js'
import { SocialTooltip } from './SocialTooltip.js'
import { makeStyles } from '@masknet/theme'
import { Icons } from '@masknet/icons'
import { useI18N } from '../locales/index.js'
import { resolveNextIDPlatformIcon } from './utils.js'
import { PluginHeader } from './PluginHeader.js'
import { SuffixToChainIconMap } from '../constants.js'

interface StyleProps {
    isMenuScroll?: boolean
}

const useStyles = makeStyles<StyleProps>()((theme) => {
    return {
        root: {
            padding: theme.spacing(0, 2),
        },
        ensInfo: {
            height: 42,
            display: 'flex',
            alignItems: 'center',
            marginBottom: 16,
        },
        ensIcon: {
            marginRight: 4,
        },
        domain: {
            fontWeight: 700,
            color: theme.palette.maskColor.publicMain,
            fontSize: 18,
            lineHeight: '18px',
        },
        reversedAddress: {
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.maskColor.secondaryDark,
            fontSize: 14,
            lineHeight: '18px',
        },
        nextIdVerified: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: 12,
        },
        socialName: {
            color: theme.palette.maskColor.dark,
            whiteSpace: 'nowrap',
            maxWidth: 85,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 400,
            marginLeft: 4,
            fontSize: 14,
        },
        rightSpace: {
            marginRight: 6,
        },
        link: {
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none !important',
        },
        linkOutIcon: {
            color: theme.palette.maskColor.dark,
            cursor: 'pointer',
        },
        bindingsWrapper: {
            display: 'flex',
            width: 520,
            alignItems: 'center',
            overflow: 'hidden',
        },
        badge: {
            display: 'flex',
            marginRight: 12,
            alignItems: 'center',
            width: 130,
            justifyContent: 'space-between',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            height: 36,
            padding: theme.spacing(0, 1),
            background: alpha(theme.palette.common.white, 0.5),
            borderRadius: 8,
        },
        reversedAddressIcon: {
            marginRight: 2,
            marginBottom: 1,
            cursor: 'pointer',
            color: theme.palette.maskColor.secondaryDark,
        },
    }
})

export function SearchResultInspectorContent() {
    const t = useI18N()
    const { classes, cx } = useStyles({})
    const { Others } = useWeb3State(NetworkPluginID.PLUGIN_EVM)
    const { reversedAddress, nextIdBindings, domain } = useContext(ENSContext)
    const [, copyToClipboard] = useCopyToClipboard()
    const copyWalletAddress = useSnackbarCallback({
        executor: async (address: string) => copyToClipboard(address),
        deps: [],
        successText: t.wallets_address_copied(),
    })
    const isShowSocialAccountList = nextIdBindings.length > 3
    const suffix = domain ? domain.split('.').pop()! : undefined
    const ChainIcon = suffix ? SuffixToChainIconMap[suffix] ?? Icons.ETH : null

    const { setPair } = ScopedDomainsContainer.useContainer()
    useEffect(() => {
        if (!reversedAddress || !domain) return
        setPair(reversedAddress, domain)
    }, [reversedAddress, domain])

    return (
        <>
            <PluginHeader />
            <Box className={classes.root}>
                <section className={classes.ensInfo}>
                    {domain && ChainIcon ? <ChainIcon size={30} className={classes.ensIcon} /> : null}
                    <div>
                        {domain ? <Typography className={classes.domain}>{domain}</Typography> : null}
                        {reversedAddress ? (
                            <Typography className={classes.reversedAddress}>
                                {reversedAddress}{' '}
                                <Icons.Copy
                                    size={20}
                                    className={classes.reversedAddressIcon}
                                    onClick={() => copyWalletAddress(reversedAddress ?? '')}
                                />
                                <Link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={classes.link}
                                    href={
                                        Others?.explorerResolver.addressLink?.(ChainId.Mainnet, reversedAddress) ?? ''
                                    }>
                                    <Icons.LinkOut size={20} className={classes.reversedAddressIcon} />
                                </Link>
                            </Typography>
                        ) : null}
                    </div>
                </section>
                {nextIdBindings?.[0]?.identity ? (
                    <div className={classes.nextIdVerified}>
                        <section className={classes.bindingsWrapper}>
                            {nextIdBindings.map((x, i) => (
                                <SocialTooltip key={i} platform={x.source}>
                                    <div
                                        className={classes.badge}
                                        onClick={() =>
                                            openWindow(resolveNextIDPlatformLink(x.platform, x.identity, x.name))
                                        }>
                                        <div className={classes.link}>
                                            {resolveNextIDPlatformIcon(x.platform)}
                                            <Typography className={cx(classes.socialName, classes.rightSpace)}>
                                                {x.name}
                                            </Typography>
                                        </div>
                                        <Icons.LinkOut size={20} className={classes.linkOutIcon} />
                                    </div>
                                </SocialTooltip>
                            ))}
                        </section>

                        {isShowSocialAccountList ? <SocialAccountList nextIdBindings={nextIdBindings} /> : null}
                    </div>
                ) : null}
            </Box>
        </>
    )
}

export function SearchResultInspector(props: SearchResultInspectorProps) {
    return (
        <ENSProvider {...props}>
            <SearchResultInspectorContent />
        </ENSProvider>
    )
}
