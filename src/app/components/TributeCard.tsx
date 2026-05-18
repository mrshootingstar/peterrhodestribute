import { Fragment } from 'react';

type TributeLink = {
  href: string;
  label: string;
};

type TributeCardProps = {
  title: string;
  subtitle?: string;
  links: TributeLink[];
};

const shellClasses =
  'bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-blue-500/20';

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

export function TributeCard({ title, subtitle, links }: TributeCardProps) {
  if (links.length === 1) {
    const link = links[0];
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group ${shellClasses}`}
      >
        <div className="text-center">
          <h4 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
            {title}
          </h4>
          {subtitle && (
            <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
            <span className="text-sm font-medium">{link.label}</span>
            <ArrowIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className={shellClasses}>
      <div className="text-center">
        <h4 className="text-lg sm:text-xl font-bold text-white mb-3">{title}</h4>
        {subtitle && (
          <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex items-center justify-center gap-6">
          {links.map((link, i) => (
            <Fragment key={link.href}>
              {i > 0 && <span className="text-gray-500">|</span>}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium whitespace-nowrap"
              >
                {link.label}
                <ArrowIcon className="w-4 h-4 ml-1 transform hover:translate-x-1 transition-transform" />
              </a>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
