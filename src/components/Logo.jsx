export default function Logo({ className = "w-12 h-12" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="2" className="fill-violet-600 dark:fill-violet-500" />
      <rect x="14" y="3" width="7" height="7" rx="2" className="fill-zinc-900 dark:fill-zinc-50" />
      <rect x="14" y="14" width="7" height="7" rx="2" className="fill-emerald-500" />
      <path d="M3 16C3 14.8954 3.89543 14 5 14H8.5L5.5 21H5C3.89543 21 3 20.1046 3 19V16Z" className="fill-zinc-900 dark:fill-zinc-50" />
      <path d="M10 14L6.5 21H8.5C9.60457 21 10.5 20.1046 10.5 19V14H10Z" className="fill-zinc-900 dark:fill-zinc-50" />
    </svg>
  );
}
