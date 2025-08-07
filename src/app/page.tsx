"use client"
import Dashboard from "@/components/Dashboard";
import { useState } from "react";

export type AutopilotProtocol = 'morpho' | 'euler';
export type AutopilotAsset = 'USDC' | 'ETH' | 'cbBTC';
export type UserState = 'new' | 'active' | 'old';

export interface AutopilotProduct {
  protocol: AutopilotProtocol;
  asset: AutopilotAsset;
}

// Simple routing system
type Route = 'home' | 'app' | 'about' | 'documentation';
type AppView = 'dashboard' | 'portfolio' | 'earnings';

export default function Home() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [currentAppView, setCurrentAppView] = useState<AppView>('dashboard');
  const [previousRoute, setPreviousRoute] = useState<Route>('home');
  const [initialDashboardTab, setInitialDashboardTab] = useState<string>('overview');
  const [selectedAutopilot, setSelectedAutopilot] = useState<AutopilotProduct>({ protocol: 'morpho', asset: 'USDC' });
  const [userState, setUserState] = useState<UserState>('active');
  return (
    <>
      <Dashboard
          initialTab={initialDashboardTab}
          selectedAutopilot={selectedAutopilot}
          onAutopilotChange={setSelectedAutopilot}
          userState={userState}
          onUserStateChange={setUserState}
      />
    </>
  );
}
