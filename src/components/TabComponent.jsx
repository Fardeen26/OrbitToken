import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { Divider } from "@nextui-org/divider";

const CustomTab = ({
    // eslint-disable-next-line react/prop-types
    children,
    ...otherProps
}) => (
    <Tab {...otherProps}>
        <h1>{children}</h1>
    </Tab>
);

CustomTab.tabsRole = 'Tab';

// eslint-disable-next-line react/prop-types
const TabComponent = ({ title1, title2, panel1, panel2 }) => (
    <div className="flex justify-center">
        <Tabs className='w-full flex flex-col items-center'>
            <TabList className='flex gap-5 cursor-pointer px-4 py-2 bg-gray-100 rounded-full items-center w-96 justify-center'>
                <CustomTab >
                    <span className='transition-all hover:text-red-500'>{title1}</span>
                </CustomTab>
                <span>
                    <Divider orientation="vertical" className='h-4 w-[1px] bg-black' />
                </span>
                <CustomTab >
                    <span className='transition-all hover:text-red-500'>{title2}</span>
                </CustomTab>
            </TabList>

            <TabPanel>{panel1}</TabPanel>
            <TabPanel>{panel2}</TabPanel>
        </Tabs>
    </div>
);

export default TabComponent