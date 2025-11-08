interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Image */}
      <img
        src="/logo.png"
        alt="Aghna Dental Care"
        className={`${sizes[size]} object-contain`}
      />

      {/* Text */}
      {showText && size !== 'sm' && (
        <div>
          <p className="text-xs text-gray-600">Care System</p>
        </div>
      )}
    </div>
  );
}
