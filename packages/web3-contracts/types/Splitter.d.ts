/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from 'bn.js'
import type { ContractOptions } from 'web3-eth-contract'
import type { EventLog } from 'web3-core'
import type { EventEmitter } from 'events'
import type {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types.js'

export interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export interface Splitter extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): Splitter
    clone(): Splitter
    methods: {
        splitTransfer(
            toFirst: string,
            toSecond: string,
            valueFirst: number | string | BN,
            valueSecond: number | string | BN,
            tokenAddress: string,
        ): NonPayableTransactionObject<void>
    }
    events: {
        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }
}
