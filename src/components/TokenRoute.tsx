import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TokenBalance } from "./TokenBalance"
import { TransferForm } from "./TransferToken"
import { CreateTokenForm } from "./CreateTokenForm"

export default function TokenRoute() {
    return (
        <Tabs defaultValue="balance" className="space-y-4 flex flex-col items-center mt-4 w-full max-sm:px-2">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]" >
                <TabsTrigger value="balance" > Token Balance </TabsTrigger>
                <TabsTrigger value="transfer" > Transfer </TabsTrigger>
                <TabsTrigger value="create" > Create Token </TabsTrigger>
            </TabsList>
            <TabsContent value="balance" className="space-y-4 flex justify-center">
                <TokenBalance />
            </TabsContent>
            <TabsContent value="transfer" className="w-full px-8 max-sm:px-0">
                <TransferForm />
            </TabsContent>
            <TabsContent value="create" className="w-full px-8 pb-2 max-sm:px-0">
                <CreateTokenForm />
            </TabsContent>
        </Tabs>
    )
}