import React, { useMemo } from 'react'
import { EmptyStatus, LoadingStatus } from '@masknet/shared'
import { useI18N } from '../../locales/i18n_generated.js'
import { CountdownTimer } from './CountDownTimer.js'
import { makeStyles } from '@masknet/theme'
import { Typography } from '@mui/material'
import { formatDate } from './EventList.js'
import format from 'date-fns/format'

const useStyles = makeStyles()((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '506px',
        width: '100%',
        overflow: 'overlay',
        position: 'relative',
        gap: '10px',
        paddingBottom: '50px',
    },
    empty: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 12,
        color: theme.palette.maskColor.second,
        whiteSpace: 'nowrap',
    },
    eventCard: {
        display: 'flex',
        padding: '8px 12px',
        flexDirection: 'column',
        gap: '8px',
        fontWeight: 700,
        lineHeight: '16px',
        fontSize: '12px',
        cursor: 'pointer',
    },
    eventHeader: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
    },
    projectWrap: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        color: theme.palette.maskColor.main,
    },
    projectName: {
        color: theme.palette.maskColor.main,
        fontSize: '12px',
        fontWeight: 700,
        lineHeight: '16px',
    },
    logo: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
    },
    eventTitle: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '18px',
        color: theme.palette.maskColor.main,
    },
    second: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '18px',
        color: theme.palette.maskColor.second,
    },
    poster: {
        borderRadius: '8px',
        width: '100%',
        height: '156px',
        objectFit: 'cover',
    },
    dateDiv: {
        fontSize: '14px',
        fontWeight: 700,
        lineHeight: '18px',
        color: theme.palette.maskColor.main,
        padding: '10px 12px',
    },
}))

interface NFTListProps {
    list: Record<string, any[]>
    isLoading: boolean
    empty: boolean
    dateString: string
}

export function NFTList({ list, isLoading, empty, dateString }: NFTListProps) {
    const { classes, cx } = useStyles()
    const t = useI18N()
    const listAfterDate = useMemo(() => {
        const listAfterDate: string[] = []
        for (const key in list) {
            if (new Date(key) >= new Date(dateString)) {
                listAfterDate.push(key)
            }
        }
        return listAfterDate
    }, [list, dateString])
    return (
        <div className={classes.container}>
            {isLoading && !list?.length ? (
                <div className={cx(classes.empty, classes.eventTitle)}>
                    <LoadingStatus />
                </div>
            ) : !empty && listAfterDate.length ? (
                listAfterDate.map((key) => {
                    return (
                        <div key={key}>
                            <Typography className={classes.dateDiv}>{format(new Date(key), 'MMM dd,yyy')}</Typography>
                            {list[key].map((v) => (
                                <div
                                    className={classes.eventCard}
                                    key={v.eventTitle}
                                    onClick={() => {
                                        window.open(v.event_url)
                                    }}>
                                    <div className={classes.eventHeader}>
                                        <div className={classes.projectWrap}>
                                            <img src={v.project.logo} className={classes.logo} alt="logo" />
                                            <Typography className={classes.projectName}> {v.project.name}</Typography>
                                        </div>
                                    </div>
                                    <Typography className={classes.eventTitle}>{v.event_title}</Typography>
                                    <div className={classes.eventHeader}>
                                        <CountdownTimer targetDate={new Date(v.event_date)} />
                                    </div>
                                    <div className={classes.eventHeader}>
                                        <Typography className={classes.second}>{t.total()}</Typography>
                                        <Typography className={classes.eventTitle}>
                                            {v.ext_info.nft_info.total}
                                        </Typography>
                                    </div>
                                    <div className={classes.eventHeader}>
                                        <Typography className={classes.second}>{t.price()}</Typography>
                                        <Typography className={classes.eventTitle}>
                                            {v.ext_info.nft_info.token}
                                        </Typography>
                                    </div>
                                    <div className={classes.eventHeader}>
                                        <Typography className={classes.second}>{t.date()}</Typography>
                                        <Typography className={classes.eventTitle}>
                                            {formatDate(v.event_date)}
                                        </Typography>
                                    </div>
                                    <img className={classes.poster} src={v.poster_url} alt="poster" />
                                </div>
                            ))}
                        </div>
                    )
                })
            ) : (
                <EmptyStatus className={classes.empty}>{t.empty_status()}</EmptyStatus>
            )}
        </div>
    )
}
