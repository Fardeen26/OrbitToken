import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { Divider } from "@nextui-org/divider";
import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const CustomTab = ({ children, ...otherProps }) => (
    <Tab {...otherProps}>
        <h1>{children}</h1>
    </Tab>
);

CustomTab.tabsRole = 'Tab';

// eslint-disable-next-line react/prop-types
const TabComponent = ({ title1, title2, title3, panel1, panel2, panel3, storageKey }) => {
    // eslint-disable-next-line no-unused-vars
    const [selectedStorageKey, setSelectedStorageKey] = useState(storageKey)
    const initialTabIndex = localStorage.getItem(storageKey)
        ? parseInt(localStorage.getItem(storageKey), 10)
        : 0;

    const [selectedTabIndex, setSelectedTabIndex] = useState(initialTabIndex);

    useEffect(() => {
        localStorage.setItem(storageKey, selectedTabIndex);
    }, [selectedTabIndex, storageKey]);

    return (
        <div className="flex justify-center dark:bg-black dark:text-white">
            <Tabs
                className="w-full flex flex-col items-center dark:bg-black dark:text-white"
                selectedIndex={selectedTabIndex}
                onSelect={(index) => setSelectedTabIndex(index)}
            >
                <TabList className='dark:bg-blue-950 bg-gray-100 dark:text-white flex gap-5 cursor-pointer px-10 py-2 rounded-full items-center justify-center w-fit border-none'>
                    <CustomTab className='border-none'>
                        <span className={`transition-all border-none dark:hover:text-[#d4c2ff] hover:text-[#6a2aff] ${selectedTabIndex === 0 ? "dark:text-[#d4c2ff] text-[#6a2aff]" : ""}`}>
                            {title1}
                        </span>
                    </CustomTab>
                    <span>
                        <Divider orientation="vertical" className='h-4 w-[1px] bg-black' />
                    </span>
                    <CustomTab className='border-none'>
                        <span className={`transition-all border-none dark:hover:text-[#d4c2ff] hover:text-[#6a2aff] ${selectedTabIndex === 1 ? "dark:text-[#d4c2ff] text-[#6a2aff]" : ""}`}>
                            {title2}
                        </span>
                    </CustomTab>
                    <span className={`${selectedStorageKey == "token-tabs" ? 'visible' : 'hidden'}`}>
                        <Divider orientation="vertical" className={`h-4 w-[1px] bg-black`} />
                    </span>
                    <CustomTab className={`${selectedStorageKey == "token-tabs" ? 'visible' : 'hidden'} border-none`}>
                        <span className={`transition-all border-none dark:hover:text-[#d4c2ff] hover:text-[#6a2aff] ${selectedTabIndex === 2 ? "dark:text-[#d4c2ff] text-[#6a2aff]" : ""}`}>
                            {title3}
                        </span>
                    </CustomTab>
                </TabList>

                <TabPanel>{panel1}</TabPanel>
                <TabPanel>{panel2}</TabPanel>
                <TabPanel className={`${selectedStorageKey == "token-tabs" ? 'visible' : 'hidden'}`}>{panel3}</TabPanel>
            </Tabs>
        </div>
    );
};

export default TabComponent;
