import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

function SendSOLToRandomAddress() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const sendSol = async () => {
        if (!wallet.publicKey) throw new WalletNotConnectedError();

        const lamports = await connection.getMinimumBalanceForRentExemption(0);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey('fmGcXB4pNLnbJP9QjvsVqxTZiX8zkbLqJD55RD9qPjG'),
                lamports,
            })
        );

        try {
            const tnx = await wallet.sendTransaction(transaction, connection)
            console.log('tnx is send', tnx)
        } catch (error) {
            console.log("error occurred", error)
        }
    }

    return (
        <div className="">
            <input type="text" placeholder='amount' />
            <input type="text" placeholder='recipient' />
            <button onClick={sendSol} disabled={!wallet.publicKey}>
                Transfer SOL
            </button>
        </div>
    );
};

export default SendSOLToRandomAddress;