import TokenBalance from "./TokenBalance";
import TokenTransfer from "./TokenTransfer";
import TabComponent from "./TabComponent";
import CreateToken from "./CreateToken";

const Token = () => {
    return (
        <div className="mt-10">
            <TabComponent
                title1={"Token Balance"}
                title2={"Transfer Token"}
                title3={"Create Token"}
                panel1={<TokenBalance />}
                panel2={<TokenTransfer />}
                panel3={<CreateToken />}
                storageKey="token-tabs"
            />
        </div>
    );
};

export default Token
