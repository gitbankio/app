interface BaseLogoProps {
  className?: string;
}

export function BaseLogo({ className }: BaseLogoProps) {
  return (
    <svg
      viewBox="0 0 88 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Base"
      role="img"
    >
      <rect width="24" height="24" rx="4" fill="#0052FF" />
      <text
        x="30"
        y="19"
        fill="currentColor"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="19"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        base
      </text>
    </svg>
  );
}
