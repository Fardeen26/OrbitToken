import SignMessage from "./SignMessage";
import TabComponent from "../ui/TabComponent";
import TransferSOL from "./TransferSOL";

const Transaction = () => {
    return (
        <div className="mt-10">
            <TabComponent
                title1={"Transfer SOL"}
                title2={"Sign Message"}
                panel1={<TransferSOL />}
                panel2={<SignMessage />}
                storageKey="transaction-tabs"
            />
        </div>
    );
};

export default Transaction;