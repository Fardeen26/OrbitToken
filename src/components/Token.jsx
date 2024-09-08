import TokenBalance from "./TokenBalance";
import TokenTransfer from "./TokenTransfer";
import TabComponent from "./TabComponent";

const Token = () => {
    return (
        <div className="mt-10">
            <TabComponent
                title1={"Token Balance"}
                title2={"Transfer Token"}
                panel1={<TokenBalance />}
                panel2={<TokenTransfer />}
                storageKey="token-tabs"
            />
        </div>
    );
};

export default Token
