import { Calendar } from '@masknet/web3-providers'
import { useInfiniteQuery } from '@tanstack/react-query'
import { addDays, startOfMonth } from 'date-fns'

export function useLumaEvents(date: Date, enabled = true) {
    const startTime = startOfMonth(date).getTime()
    const endTime = addDays(startOfMonth(date), 45).getTime()
    return useInfiniteQuery({
        enabled,
        queryKey: ['lumaEvents', startTime, endTime],
        initialPageParam: undefined as any,
        queryFn: async ({ pageParam }) => {
            return Calendar.getEventList(startTime, endTime, pageParam)
        },
        getNextPageParam(page) {
            return page.nextIndicator
        },
        select(data) {
            return data.pages.flatMap((x) => x.data)
        },
    })
}
