import { difference } from 'lodash-es'
import { useContainer } from '@masknet/shared-base-ui'
import { makeStyles, ActionButton } from '@masknet/theme'
import { Box, DialogContent } from '@mui/material'
import type { BoxInfo } from '../../type.js'
import { TokenCard } from './TokenCard.js'
import { InjectedDialog } from '@masknet/shared'
import { Context } from '../../hooks/useContext.js'
import type { NonFungibleTokenContract } from '@masknet/web3-shared-base'
import type { ChainId, SchemaType } from '@masknet/web3-shared-evm'
import { Icons } from '@masknet/icons'
import { usePostLink } from '@masknet/plugin-infra/content-script'
import { share } from '@masknet/plugin-infra/content-script/context'
import { useLingui } from '@lingui/react'
import { msg } from '@lingui/macro'

const useStyles = makeStyles()((theme) => ({
    main: { padding: 8 },
    list: {
        height: 360,
        overflow: 'auto',
        marginBottom: theme.spacing(2),
        display: 'grid',
        flexWrap: 'wrap',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gridGap: theme.spacing(1),
        padding: 8,
    },
    token: {},
}))

interface DrawResultDialogProps {
    open: boolean
    onClose: () => void
    boxInfo: BoxInfo
    contractDetailed?: NonFungibleTokenContract<ChainId, SchemaType>
}

export function DrawResultDialog(props: DrawResultDialogProps) {
    const { open, onClose, boxInfo, contractDetailed } = props
    const { classes } = useStyles()
    const { lastPurchasedTokenIds } = useContainer(Context)

    const postLink = usePostLink()
    const { _ } = useLingui()
    const shareText =
        _(msg`I just claimed a #MaskBox with @realMaskNetwork. Install mask.io and create your own NFT mystery box!`) +
        `\n${postLink}`

    const onShare = () => {
        onClose()
        share?.(shareText)
    }

    if (!contractDetailed) return null

    return (
        <InjectedDialog title="Successful" open={open} onClose={onClose}>
            <DialogContent>
                <Box className={classes.main}>
                    <Box className={classes.list} display="flex" flexWrap="wrap">
                        {difference(boxInfo.tokenIdsPurchased, lastPurchasedTokenIds).map((x, i) => (
                            <Box className={classes.token} key={x} flex={1}>
                                <TokenCard tokenId={x} contractDetailed={contractDetailed} />
                            </Box>
                        ))}
                    </Box>
                    <ActionButton startIcon={<Icons.Shared size={18} />} size="medium" fullWidth onClick={onShare}>
                        Share
                    </ActionButton>
                </Box>
            </DialogContent>
        </InjectedDialog>
    )
}
