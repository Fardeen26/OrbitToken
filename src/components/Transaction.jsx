import SignMessage from "./SignMessage"
import TabComponent from "./TabComponent"
import TransferSOL from "./TransferSOL"

export const Transaction = () => {
    return (
        <div className="mt-10">
            <TabComponent title1={"Send SOL"} title2={"Sign Message"} panel1={<TransferSOL />} panel2={<SignMessage />} />
        </div>
    )
}
