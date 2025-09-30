// import { Hash, LucideProps, X } from 'lucide-react';
// import { ForwardRefExoticComponent, RefAttributes } from 'react';
import Image from 'next/image';

const links = [
  {
    title: 'Support',
    subTitle: 'Get help on Discord',
    url: 'https://discord.gg/GYsW9pV2Eu',
    icon: '/socials/discord.png',
    darkThemeIcon: '/socials/discord-white.png',
  },
  {
    title: 'Follow us',
    subTitle: 'Latest updates',
    url: 'https://x.com/Autopilot_fi',
    icon: '/socials/x.png',
    darkThemeIcon: '/socials/x-white.png',
  },
];

const SupportOrSocialLink = ({
  title,
  // subTitle,
  url,
  icon,
  darkThemeIcon,
  isDarkMode,
}: {
  title: string;
  subTitle: string;
  url: string;
  icon: string;
  darkThemeIcon: string;
  isDarkMode?: boolean;
}) => (
  <a
    href={url}
    target="_blank"
    className={`flex-1 flex items-center space-x-2 p-2.5 border rounded-lg transition-colors group ${
      isDarkMode
        ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-purple-500'
        : 'bg-gray-50 hover:bg-purple-50 border-gray-200 hover:border-purple-200'
    }`}
  >
    <div
      className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
        isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-purple-100'
      }`}
    >
      <Image
        src={isDarkMode ? darkThemeIcon : icon}
        width={28}
        height={28}
        alt="icon"
        className={`w-4.5 h-4.5 transition-colors ${
          isDarkMode
            ? 'text-gray-400 group-hover:text-purple-400'
            : 'text-gray-600 group-hover:text-purple-600'
        }`}
      />
    </div>

    <div className="flex-1 text-left min-w-0">
      <div
        className={`text-xs font-medium transition-colors truncate ${
          isDarkMode
            ? 'text-gray-100 group-hover:text-purple-300'
            : 'text-gray-900 group-hover:text-purple-900'
        }`}
      >
        {title}
      </div>
      {/* <div className="text-xs text-gray-600 group-hover:text-purple-700 transition-colors">
        {subTitle}
      </div> */}
    </div>
  </a>
);

export default function SupportAndSocialLinks({ isDarkMode }: { isDarkMode?: boolean }) {
  return (
    <div className="flex space-x-2 pb-4 md:pb-6">
      {links.map(({ subTitle, title, url, icon, darkThemeIcon }) => (
        <SupportOrSocialLink
          key={title}
          subTitle={subTitle}
          title={title}
          url={url}
          icon={icon}
          isDarkMode={isDarkMode}
          darkThemeIcon={darkThemeIcon}
        />
      ))}
    </div>
  );
}
