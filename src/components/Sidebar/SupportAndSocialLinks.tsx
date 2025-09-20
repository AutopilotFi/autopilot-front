import { Hash, LucideProps, X } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

const links = [
  {
    title: 'Support',
    subTitle: 'Get help on Discord',
    url: 'https://www.autopilot.finance/',
    Icon: Hash,
  },
  {
    title: 'Follow us',
    subTitle: 'Latest updates',
    url: 'https://www.autopilot.finance/',
    Icon: X,
  },
];

const SupportOrSocialLink = ({
  title,
  subTitle,
  url,
  Icon,
}: {
  title: string;
  subTitle: string;
  url: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}) => (
  <a
    href={url}
    target="_blank"
    className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-lg transition-colors group"
  >
    <div className="w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors">
      <Icon className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
    </div>
    <div className="flex-1 text-left">
      <div className="text-sm font-medium text-gray-900 group-hover:text-purple-900 transition-colors">
        {title}
      </div>
      <div className="text-xs text-gray-600 group-hover:text-purple-700 transition-colors">
        {subTitle}
      </div>
    </div>
  </a>
);

export default function SupportAndSocialLinks() {
  return (
    <div className="space-y-3 pb-4 md:pb-6">
      {links.map(({ subTitle, title, url, Icon }) => (
        <SupportOrSocialLink key={title} subTitle={subTitle} title={title} url={url} Icon={Icon} />
      ))}
    </div>
  );
}
