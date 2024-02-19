import {
    createIndicator,
    createNextIndicator,
    createPageable,
    type Pageable,
    type PageIndicator,
    getSiteType,
    EnhanceableSite,
} from '@masknet/shared-base'
import urlcat from 'urlcat'
import { fetchJSON } from '../entry-helpers.js'
import { FireflyRedPacketAPI } from '../entry-types.js'

const siteType = getSiteType()
const SITE_URL = siteType === EnhanceableSite.Firefly ? location.origin : 'https://firefly.mask.social'
const FIREFLY_ROOT_URL = process.env.NEXT_PUBLIC_FIREFLY_API_URL ?? 'https://api.firefly.land'

const themes = [
    {
        id: 'e171b936-b5f5-415c-8938-fa1b74d1d612',
        name: 'lucky-firefly',
    },
    {
        id: 'e480132f-a853-43ea-bbab-883b463e55b3',
        name: 'lucky-flower',
    },
    {
        id: 'b64f9af2-447c-471f-998a-fa7336c57849',
        name: 'golden-flower',
    },
] as const

const jsonHeaders = {
    'Content-Type': 'application/json',
}

type WithoutChainId<T> = Omit<T, 'chain_id'>
type WithNumberChainId<T> = WithoutChainId<T> & { chain_id: number }

export class FireflyRedPacket {
    static getThemeSettings(
        from: string,
        amount?: string,
        type?: string,
        symbol?: string,
        decimals?: number,
    ): FireflyRedPacketAPI.ThemeSettings[] {
        return themes.map((theme) => ({
            id: theme.id,
            payloadUrl: urlcat(SITE_URL, '/api/rp', {
                theme: theme.name,
                usage: 'payload',
                from,
                amount,
                type,
                symbol,
                decimals,
            }),
            coverUrl: urlcat(SITE_URL, '/api/rp', {
                theme: theme.name,
                usage: 'cover',
            }),
        }))
    }

    static getPayloadUrlByThemeId(
        themeId: string,
        from: string,
        amount?: string,
        type?: string,
        symbol?: string,
        decimals?: number,
    ) {
        return urlcat(SITE_URL, '/api/rp', {
            theme: themes.find((x) => x.id === themeId)?.name || themes[0].name,
            usage: 'payload',
            from,
            amount,
            type,
            symbol,
            decimals,
        })
    }

    static async getThemeByRpid(rpid: string) {
        const url = urlcat(FIREFLY_ROOT_URL, 'v1/redpacket/themeById', {
            rpid,
        })
        const { data } = await fetchJSON<FireflyRedPacketAPI.ThemeByIdResponse>(url)
        const themeId = data.tid
        const setting = themes.find((x) => x.id === themeId) || themes[0]
        return setting.name
    }

    static async createPublicKey(
        themeId: string,
        shareFrom: string,
        payloads: FireflyRedPacketAPI.StrategyPayload[],
    ): Promise<HexString> {
        const url = urlcat(FIREFLY_ROOT_URL, '/v1/redpacket/createPublicKey')
        const { data } = await fetchJSON<FireflyRedPacketAPI.PublicKeyResponse>(url, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify({
                themeId,
                shareFrom,
                claimFrom: FireflyRedPacketAPI.SourceType.FireflyPC,
                claimStrategy: JSON.stringify(payloads),
            }),
        })

        return data.publicKey
    }

    static async updateClaimStrategy(
        rpid: string,
        reactions: FireflyRedPacketAPI.PostReaction[],
        claimPlatform: FireflyRedPacketAPI.ClaimPlatform[],
    ): Promise<void> {
        const url = urlcat(FIREFLY_ROOT_URL, '/v1/redpacket/updateClaimStrategy')
        await fetchJSON(url, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify({
                rpid,
                postReaction: reactions,
                claimPlatform,
            }),
        })
    }

    static async createClaimSignature(
        options: FireflyRedPacketAPI.CheckClaimStrategyStatusOptions,
    ): Promise<HexString> {
        const url = urlcat(FIREFLY_ROOT_URL, '/v1/redpacket/claim')
        const { data } = await fetchJSON<FireflyRedPacketAPI.ClaimResponse>(url, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify(options),
        })
        return data.signedMessage
    }

    static async getHistory<
        T extends FireflyRedPacketAPI.ActionType,
        R = T extends FireflyRedPacketAPI.ActionType.Claim ? WithNumberChainId<FireflyRedPacketAPI.RedPacketClaimedInfo>
        :   WithNumberChainId<FireflyRedPacketAPI.RedPacketSentInfo>,
    >(
        actionType: T,
        from: HexString,
        platform: FireflyRedPacketAPI.SourceType,
        indicator?: PageIndicator,
    ): Promise<Pageable<R, PageIndicator>> {
        const url = urlcat(FIREFLY_ROOT_URL, '/v1/redpacket/history', {
            address: from,
            redpacketType: actionType,
            claimFrom: platform,
            cursor: indicator?.id,
            size: 20,
        })
        const { data } = await fetchJSON<FireflyRedPacketAPI.HistoryResponse>(url, {
            method: 'GET',
        })
        return createPageable(
            data.list.map((v) => ({ ...v, chain_id: Number(v.chain_id) })) as R[],
            createIndicator(indicator),
            createNextIndicator(indicator, data.cursor?.toString()),
        )
    }

    static async getClaimHistory(
        redpacket_id: string,
        indicator?: PageIndicator,
    ): Promise<WithNumberChainId<FireflyRedPacketAPI.RedPacketClaimListInfo>> {
        const url = urlcat(FIREFLY_ROOT_URL, '/v1/redpacket/claimHistory', {
            redpacketId: redpacket_id,
            cursor: indicator?.id,
            size: 20,
        })
        const { data } = await fetchJSON<FireflyRedPacketAPI.ClaimHistoryResponse>(url, {
            method: 'GET',
        })
        return { ...data, chain_id: Number(data.chain_id) }
    }

    static async checkClaimStrategyStatus(options: FireflyRedPacketAPI.CheckClaimStrategyStatusOptions) {
        const url = urlcat(FIREFLY_ROOT_URL, '/v1/redpacket/checkClaimStrategyStatus')
        return fetchJSON<FireflyRedPacketAPI.CheckClaimStrategyStatusResponse>(url, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify(options),
        })
    }
}