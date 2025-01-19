import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token'
import * as SolanaWeb3 from /* webpackDefer: true */ '@solana/web3.js'
import { getRpProgram } from './getRpProgram.js'

export async function refundSplToken({
    id,
    tokenMint,
    tokenProgram,
    tokenAccount,
    creator,
}: {
    id: string
    tokenMint: SolanaWeb3.PublicKey
    tokenProgram: SolanaWeb3.PublicKey | null
    tokenAccount: SolanaWeb3.PublicKey | null
    creator: SolanaWeb3.PublicKey
}) {
    if (!tokenProgram || !tokenAccount) throw new Error('Token program or account not found')

    const program = await getRpProgram()
    const vault = getAssociatedTokenAddressSync(
        new SolanaWeb3.PublicKey(tokenMint),
        new SolanaWeb3.PublicKey(id),
        true,
        new SolanaWeb3.PublicKey(tokenProgram),
    )

    return program.methods
        .withdrawWithSplToken()
        .accounts({
            // @ts-expect-error missing type
            redPacket: new SolanaWeb3.PublicKey(id),
            signer: creator,
            vault,
            tokenAccount,
            tokenMint,
            tokenProgram,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc({
            commitment: 'confirmed',
        })
}