'use client';
import { createContext, useEffect, useState } from 'react';
import { UserState, SideBarOption, GlobalData } from '@/types/globalAppTypes';

const defaultGlobalData: GlobalData = {
  user: {
    status: 'active',
  },
  availableAutopilots: [],
};

export const GlobalContext = createContext<GlobalData>(defaultGlobalData);

const fetchUserData = async () => {
  const userStaus: UserState = 'active';
  return { status: userStaus };
};

export default function GlobalDataProvider({
  children,
  availableAutopilots,
}: {
  children: React.ReactNode;
  availableAutopilots: SideBarOption[];
}) {
  const [globalData, setGlobalData] = useState<GlobalData>(defaultGlobalData);
  const [isMobile, setIsMobile] = useState<boolean>();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobile(isMobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData();
      setGlobalData({
        user: userData,
        availableAutopilots,
      });
    };
    getUserData();
  }, [availableAutopilots]);

  if (isMobile !== undefined) {
    return <GlobalContext value={{ ...globalData, isMobile }}>{children}</GlobalContext>;
  } else return null;
}
