import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkMeta {
  domain?: string;
  order?: number;
  groupKey?: string;
  visibilityScope?: 'public' | 'authenticated' | 'internal';
  tags?: string[];
  critical?: boolean;
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  layout?: 'inline' | 'tab' | 'pill';
  variant?: 'default' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  activeClassName?: string;
  requiredRole?: string;
  hiddenIfUnauthorized?: boolean;
  leadingIcon?: React.ReactNode;
  meta?: NavLinkMeta;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  layout = 'inline',
  variant = 'default',
  size = 'md',
  activeClassName = '',
  leadingIcon,
  className,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  const baseStyles = 'inline-flex items-center gap-2 transition-colors duration-200';
  
  const layoutStyles = {
    inline: 'hover:text-primary',
    tab: 'px-4 py-2 border-b-2 border-transparent hover:border-primary',
    pill: 'px-3 py-1.5 rounded-full',
  };

  const variantStyles = {
    default: 'text-muted-foreground hover:text-foreground',
    primary: 'text-primary hover:text-primary/80',
    danger: 'text-destructive hover:text-destructive/80 bg-destructive/10',
  };

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Link
      to={to}
      className={cn(
        baseStyles,
        layoutStyles[layout],
        variantStyles[variant],
        sizeStyles[size],
        isActive && (activeClassName || 'text-foreground font-medium'),
        className
      )}
    >
      {leadingIcon}
      {children}
    </Link>
  );
};

export default NavLink;
