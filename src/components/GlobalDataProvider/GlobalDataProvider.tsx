"use client"
import { createContext, useEffect, useState } from 'react';
import { UserState, SideBarOption, GlobalData } from '@/types/globalAppTypes';
import { AutopilotIcon } from '../Sidebar/AutopilotIcon';

const defaultGlobalData: GlobalData = {
    user: {
        status: "active"
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
    const [isMobile, setIsMobile] = useState<boolean>();
    // Mobile detection
    useEffect(() => {
    const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
    }, []);
    useEffect(() => {
        const getUserData = async() => {
            const userData = await fetchUserData();
            setGlobalData({
                user: userData,
                availableAutopilots
            });
        }
        getUserData();
    }, [availableAutopilots]);
    if(isMobile === undefined) return null;
    if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 min-w-full">
        <div className="text-center max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-[#9159FF] rounded-2xl flex items-center justify-center">
              <AutopilotIcon className="text-white" size={32} />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Demo Available on Desktop
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our interactive demo is currently optimized for desktop devices. Please visit us on a larger screen to explore Autopilot Demo.      </p>

          {/* Back to Homepage Button */}
          <a
            href={"https://autopilot-landing-temp.vercel.app/"}
            className="inline-flex items-center px-6 py-3 bg-[#9159FF] text-white font-medium rounded-xl hover:bg-[#8b5cf6] transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    );
  }
  return(
        <GlobalContext value={globalData}>
            {children}
        </GlobalContext>
    )
}
