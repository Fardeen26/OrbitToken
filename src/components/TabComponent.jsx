import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { Divider } from "@nextui-org/divider";
import { useState, useEffect } from "react";

const CustomTab = ({ children, ...otherProps }) => (
    <Tab {...otherProps}>
        <h1>{children}</h1>
    </Tab>
);

CustomTab.tabsRole = 'Tab';

const TabComponent = ({ title1, title2, panel1, panel2, storageKey }) => {
    const initialTabIndex = localStorage.getItem(storageKey)
        ? parseInt(localStorage.getItem(storageKey), 10)
        : 0;

    const [selectedTabIndex, setSelectedTabIndex] = useState(initialTabIndex);

    useEffect(() => {
        localStorage.setItem(storageKey, selectedTabIndex);
    }, [selectedTabIndex, storageKey]);

    return (
        <div className="flex justify-center">
            <Tabs
                className="w-full flex flex-col items-center"
                selectedIndex={selectedTabIndex}
                onSelect={(index) => setSelectedTabIndex(index)}
            >
                <TabList className='flex gap-5 cursor-pointer px-4 py-2 bg-gray-100 rounded-full items-center w-96 justify-center'>
                    <CustomTab>
                        <span className={`transition-all hover:text-[#6a2aff] ${selectedTabIndex === 0 ? "text-[#6a2aff]" : ""}`}>
                            {title1}
                        </span>
                    </CustomTab>
                    <span>
                        <Divider orientation="vertical" className='h-4 w-[1px] bg-black' />
                    </span>
                    <CustomTab>
                        <span className={`transition-all hover:text-[#6a2aff] ${selectedTabIndex === 1 ? "text-[#6a2aff]" : ""}`}>
                            {title2}
                        </span>
                    </CustomTab>
                </TabList>

                <TabPanel>{panel1}</TabPanel>
                <TabPanel>{panel2}</TabPanel>
            </Tabs>
        </div>
    );
};

export default TabComponent;
