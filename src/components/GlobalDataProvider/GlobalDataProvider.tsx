"use client"
import { createContext, useEffect, useState } from 'react';
import { UserState, User, SideBarOption, GlobalData } from '@/types/globalAppTypes';

const defaultGlobalData: GlobalData = {
    user: {
        status: "new"
    },
    availableAutopilots: []
}

export const GlobalContext = createContext<GlobalData>(defaultGlobalData);

const fetchUserData = async() => {
    const userStaus: UserState = "active";
    return {status: userStaus};
}

export default function GlobalDataProvider({
  children,
  availableAutopilots
}: {
  children: React.ReactNode,
  availableAutopilots: SideBarOption[]
}){
    const [globalData, setGlobalData] = useState<GlobalData>(defaultGlobalData);
    useEffect(() => {
        const getUserData = async() => {
            const userData = await fetchUserData();
            setGlobalData({
                user: userData,
                availableAutopilots
            });
        }
        getUserData();
    }, [])
    return(
        <GlobalContext value={globalData}>
            {children}
        </GlobalContext>
    )
}
