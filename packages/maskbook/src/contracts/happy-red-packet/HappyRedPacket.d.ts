/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import { ContractEvent, Callback, TransactionObject, BlockType } from '../types'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export class HappyRedPacket extends Contract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions)
    clone(): HappyRedPacket
    methods: {
        check_availability(
            id: string | number[],
        ): TransactionObject<{
            token_address: string
            balance: string
            total: string
            claimed: string
            expired: boolean
            ifclaimed: boolean
            0: string
            1: string
            2: string
            3: string
            4: boolean
            5: boolean
        }>

        check_claimed_list(id: string | number[]): TransactionObject<string[]>

        claim(
            id: string | number[],
            password: string,
            _recipient: string,
            validation: string | number[],
        ): TransactionObject<string>

        contract_creator(): TransactionObject<string>

        create_red_packet(
            _hash: string | number[],
            _number: number | string,
            _ifrandom: boolean,
            _duration: number | string,
            _seed: string | number[],
            _message: string,
            _name: string,
            _token_type: number | string,
            _token_addr: string,
            _total_tokens: number | string,
        ): TransactionObject<void>

        refund(id: string | number[]): TransactionObject<void>

        toBytes(a: string): TransactionObject<string>

        transfer_token(
            token_type: number | string,
            token_address: string,
            sender_address: string,
            recipient_address: string,
            amount: number | string,
        ): TransactionObject<void>
    }
    events: {
        ClaimSuccess: ContractEvent<{
            id: string
            claimer: string
            claimed_value: string
            token_address: string
            0: string
            1: string
            2: string
            3: string
        }>
        CreationSuccess: ContractEvent<{
            total: string
            id: string
            creator: string
            creation_time: string
            token_address: string
            0: string
            1: string
            2: string
            3: string
            4: string
        }>
        RefundSuccess: ContractEvent<{
            id: string
            token_address: string
            remaining_balance: string
            0: string
            1: string
            2: string
        }>
        allEvents: (options?: EventOptions, cb?: Callback<EventLog>) => EventEmitter
    }
}
