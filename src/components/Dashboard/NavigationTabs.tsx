import { Dispatch, SetStateAction } from 'react';
import { Tab, TabConfig } from './Dashboard';

const TabButtons = ({
  tabs,
  setActiveTab,
  activeTab,
  isDarkMode,
}: {
  tabs: TabConfig[];
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  activeTab: Tab;
  isDarkMode?: boolean;
}) => (
  <>
    {tabs.map(tab => {
      const IconComponent = tab.icon;
      const isActive = activeTab === tab.key;

      return (
        <button
          key={tab.key}
          onClick={() => {
            setActiveTab(tab.key as typeof activeTab);
          }}
          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center space-x-2 ${
            isActive
              ? 'border-[#9159FF] text-[#9159FF]'
              : `border-transparent hover:text-[#9159FF] hover:border-[#c4b5fd] ${
                  isDarkMode ? 'text-muted-foreground' : 'text-gray-500'
                }`
          }`}
        >
          <IconComponent className="w-4 h-4" />
          <span>{tab.label}</span>
        </button>
      );
    })}
  </>
);

export default function NavigationTabs({
  tabConfig,
  activeTab,
  setActiveTab,
  isDarkMode,
}: {
  tabConfig: TabConfig[];
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  isDarkMode?: boolean;
}) {
  return (
    <div
      className={`border-b ${isDarkMode ? 'bg-card border-border' : 'bg-white border-gray-100'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center overflow-x-auto gap-8 justify-between">
          <div className="flex space-x-8 items-center">
            <TabButtons
              tabs={tabConfig.slice(0, 4)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isDarkMode={isDarkMode}
            />
          </div>
          <div className="flex space-x-8 items-center">
            <TabButtons
              tabs={tabConfig.slice(-3)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isDarkMode={isDarkMode}
            />
          </div>
        </nav>
      </div>
    </div>
  );
}
