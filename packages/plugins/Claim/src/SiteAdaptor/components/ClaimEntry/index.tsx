import { memo, useCallback } from 'react'
import { Icons } from '@masknet/icons'
import { ApplicationEntry } from '@masknet/shared'
import { useRemoteControlledDialog } from '@masknet/shared-base-ui'
import { PluginClaimMessage } from '../../../message.js'
import { useClaimTrans } from '../../../locales/index.js'

interface ClaimEntryProps {
    disabled: boolean
    tooltipHint?: string
    onClick?: (walletConnectedCallback?: () => void) => void
}

export const ClaimEntry = memo<ClaimEntryProps>((props) => {
    const { setDialog } = useRemoteControlledDialog(PluginClaimMessage.claimDialogEvent)
    const handleClick = useCallback(() => {
        setDialog({
            open: true,
        })
    }, [setDialog])

    return (
        <ApplicationEntry
            {...props}
            icon={<Icons.MarketsClaim size={36} />}
            title={<Name />}
            onClick={() => (props.onClick ? props.onClick(handleClick) : handleClick())}
        />
    )
})
function Name() {
    const t = useClaimTrans()
    return t.__plugin_name()
}
