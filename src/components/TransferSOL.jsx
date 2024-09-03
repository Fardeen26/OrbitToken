import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

function TransferSOL() {
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
        <div className="mt-20 flex justify-center  p-5 w-[30vw] items-center rounded-lg bg-white">
            <form action="" className='flex flex-col items-center gap-3' onSubmit={sendSol}>
                <input type="text" placeholder='recipient' className='bg-black placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border' />
                <input type="text" placeholder='amount' className='bg-black placeholder:text-white text-white w-[25vw] px-3 py-[9px] rounded-lg border' />
                <button className='text-xl mt-5 px-3 py-[6px] w-[25vw] bg-[#512DA8] text-white rounded hover:bg-black font-mono'>Send</button>
            </form>
        </div>
    );
};

export default TransferSOL;