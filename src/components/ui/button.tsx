import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold',
  secondary: 'bg-raised hover:bg-hover border border-line-bright text-slate-200',
  ghost: 'text-slate-400 hover:text-white hover:bg-slate-800',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white font-bold',
  warning: 'bg-amber-500 hover:bg-amber-400 text-black font-bold'
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
}

/** House button. Defaults to `type="button"` so it never submits a form by accident. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', className, type = 'button', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'tap-target inline-flex items-center justify-center gap-1.5 rounded font-mono transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'px-2.5 py-1.5 text-caption' : 'px-4 py-2.5 sm:py-2 text-xs',
        VARIANTS[variant],
        className
      )}
      {...rest}
    />
  );
});
