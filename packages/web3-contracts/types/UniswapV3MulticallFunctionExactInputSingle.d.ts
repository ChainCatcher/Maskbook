/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js'
import { ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export interface UniswapV3MulticallFunctionExactInputSingle extends BaseContract {
    constructor(
        jsonInterface: any[],
        address?: string,
        options?: ContractOptions,
    ): UniswapV3MulticallFunctionExactInputSingle
    clone(): UniswapV3MulticallFunctionExactInputSingle
    methods: {}
    events: {
        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }
}