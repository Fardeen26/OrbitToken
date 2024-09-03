import TabComponent from "./TabComponent";
import TokenBalance from "./TokenBalance";
import TokenTransfer from "./TokenTransfer";
// import ShowTokenBalance from "../ShowTokenBalance";

const Token = () => (
    <div className="flex justify-center mt-10">
        <TabComponent title1={"Token Balance"} title2={"Transfer Token"} panel1={<TokenBalance />} panel2={<TokenTransfer />} />
        {/* <ShowTokenBalance /> */}
    </div>
);

export default Token