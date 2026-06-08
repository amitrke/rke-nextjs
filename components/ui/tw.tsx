import { CSSProperties, ReactElement, ReactNode, createContext, useContext, useMemo, useState } from 'react';

type CommonProps = {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
};

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export function Container({ fluid, className, children }: CommonProps & { fluid?: boolean }) {
  return <div className={cn(fluid ? 'w-full px-4' : 'mx-auto w-full max-w-7xl px-4', className)}>{children}</div>;
}

export function Row({ className, children }: CommonProps) {
  return <div className={cn('-mx-3 flex flex-wrap', className)}>{children}</div>;
}

const colWidthClasses: Record<number, string> = {
  1: 'basis-[8.333333%] max-w-[8.333333%]',
  2: 'basis-[16.666667%] max-w-[16.666667%]',
  3: 'basis-1/4 max-w-[25%]',
  4: 'basis-1/3 max-w-[33.333333%]',
  5: 'basis-[41.666667%] max-w-[41.666667%]',
  6: 'basis-1/2 max-w-[50%]',
  7: 'basis-[58.333333%] max-w-[58.333333%]',
  8: 'basis-2/3 max-w-[66.666667%]',
  9: 'basis-3/4 max-w-[75%]',
  10: 'basis-[83.333333%] max-w-[83.333333%]',
  11: 'basis-[91.666667%] max-w-[91.666667%]',
  12: 'basis-full max-w-full',
};

const colWidthClassesSm: Record<number, string> = {
  1: 'sm:basis-[8.333333%] sm:max-w-[8.333333%]',
  2: 'sm:basis-[16.666667%] sm:max-w-[16.666667%]',
  3: 'sm:basis-1/4 sm:max-w-[25%]',
  4: 'sm:basis-1/3 sm:max-w-[33.333333%]',
  5: 'sm:basis-[41.666667%] sm:max-w-[41.666667%]',
  6: 'sm:basis-1/2 sm:max-w-[50%]',
  7: 'sm:basis-[58.333333%] sm:max-w-[58.333333%]',
  8: 'sm:basis-2/3 sm:max-w-[66.666667%]',
  9: 'sm:basis-3/4 sm:max-w-[75%]',
  10: 'sm:basis-[83.333333%] sm:max-w-[83.333333%]',
  11: 'sm:basis-[91.666667%] sm:max-w-[91.666667%]',
  12: 'sm:basis-full sm:max-w-full',
};

const colWidthClassesMd: Record<number, string> = {
  1: 'md:basis-[8.333333%] md:max-w-[8.333333%]',
  2: 'md:basis-[16.666667%] md:max-w-[16.666667%]',
  3: 'md:basis-1/4 md:max-w-[25%]',
  4: 'md:basis-1/3 md:max-w-[33.333333%]',
  5: 'md:basis-[41.666667%] md:max-w-[41.666667%]',
  6: 'md:basis-1/2 md:max-w-[50%]',
  7: 'md:basis-[58.333333%] md:max-w-[58.333333%]',
  8: 'md:basis-2/3 md:max-w-[66.666667%]',
  9: 'md:basis-3/4 md:max-w-[75%]',
  10: 'md:basis-[83.333333%] md:max-w-[83.333333%]',
  11: 'md:basis-[91.666667%] md:max-w-[91.666667%]',
  12: 'md:basis-full md:max-w-full',
};

const colWidthClassesLg: Record<number, string> = {
  1: 'lg:basis-[8.333333%] lg:max-w-[8.333333%]',
  2: 'lg:basis-[16.666667%] lg:max-w-[16.666667%]',
  3: 'lg:basis-1/4 lg:max-w-[25%]',
  4: 'lg:basis-1/3 lg:max-w-[33.333333%]',
  5: 'lg:basis-[41.666667%] lg:max-w-[41.666667%]',
  6: 'lg:basis-1/2 lg:max-w-[50%]',
  7: 'lg:basis-[58.333333%] lg:max-w-[58.333333%]',
  8: 'lg:basis-2/3 lg:max-w-[66.666667%]',
  9: 'lg:basis-3/4 lg:max-w-[75%]',
  10: 'lg:basis-[83.333333%] lg:max-w-[83.333333%]',
  11: 'lg:basis-[91.666667%] lg:max-w-[91.666667%]',
  12: 'lg:basis-full lg:max-w-full',
};

const colWidthClassesXl: Record<number, string> = {
  1: 'xl:basis-[8.333333%] xl:max-w-[8.333333%]',
  2: 'xl:basis-[16.666667%] xl:max-w-[16.666667%]',
  3: 'xl:basis-1/4 xl:max-w-[25%]',
  4: 'xl:basis-1/3 xl:max-w-[33.333333%]',
  5: 'xl:basis-[41.666667%] xl:max-w-[41.666667%]',
  6: 'xl:basis-1/2 xl:max-w-[50%]',
  7: 'xl:basis-[58.333333%] xl:max-w-[58.333333%]',
  8: 'xl:basis-2/3 xl:max-w-[66.666667%]',
  9: 'xl:basis-3/4 xl:max-w-[75%]',
  10: 'xl:basis-[83.333333%] xl:max-w-[83.333333%]',
  11: 'xl:basis-[91.666667%] xl:max-w-[91.666667%]',
  12: 'xl:basis-full xl:max-w-full',
};

export function Col({ className, children, xs, sm, md, lg, xl }: CommonProps & { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }) {
  const safeValue = (value?: number) => (value && value >= 1 && value <= 12 ? value : undefined);
  const xsValue = safeValue(xs);
  const smValue = safeValue(sm);
  const mdValue = safeValue(md);
  const lgValue = safeValue(lg);
  const xlValue = safeValue(xl);

  return (
    <div
      className={cn(
        'w-full basis-full px-3',
        xsValue ? colWidthClasses[xsValue] : '',
        smValue ? colWidthClassesSm[smValue] : '',
        mdValue ? colWidthClassesMd[mdValue] : '',
        lgValue ? colWidthClassesLg[lgValue] : '',
        xlValue ? colWidthClassesXl[xlValue] : '',
        className,
      )}
    >
      {children}
    </div>
  );
}

type ButtonProps = CommonProps & {
  variant?: string;
  size?: 'sm' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: any) => void;
  href?: string;
  target?: string;
  rel?: string;
};

const buttonVariantClass = (variant?: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 text-white hover:bg-blue-700';
    case 'secondary':
      return 'bg-slate-600 text-white hover:bg-slate-700';
    case 'success':
      return 'bg-emerald-600 text-white hover:bg-emerald-700';
    case 'danger':
      return 'bg-rose-600 text-white hover:bg-rose-700';
    case 'warning':
      return 'bg-amber-500 text-black hover:bg-amber-600';
    case 'outline-primary':
      return 'border border-blue-500 text-blue-700 hover:bg-blue-50';
    case 'outline-secondary':
      return 'border border-slate-400 text-slate-700 hover:bg-slate-100';
    case 'outline-danger':
      return 'border border-rose-400 text-rose-700 hover:bg-rose-50';
    case 'outline-warning':
      return 'border border-amber-400 text-amber-700 hover:bg-amber-50';
    case 'outline-info':
      return 'border border-cyan-400 text-cyan-700 hover:bg-cyan-50';
    case 'outline-dark':
      return 'border border-slate-800 text-slate-800 hover:bg-slate-100';
    case 'link':
      return 'bg-transparent p-0 text-blue-600 hover:text-blue-700';
    default:
      return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
  }
};

export function Button({ variant, size, className, children, href, target, rel, type = 'button', disabled, onClick }: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
    size === 'sm' && 'px-2.5 py-1.5 text-xs',
    size === 'lg' && 'px-4 py-2.5 text-base',
    buttonVariantClass(variant),
    disabled && 'cursor-not-allowed opacity-60',
    className,
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export function ButtonGroup({ className, children }: CommonProps) {
  return <div className={cn('inline-flex flex-wrap gap-2', className)}>{children}</div>;
}

export function Badge({ className, children, bg, text, pill }: CommonProps & { bg?: string; text?: string; pill?: boolean }) {
  const bgClass =
    bg === 'danger'
      ? 'bg-rose-100 text-rose-700'
      : bg === 'success'
        ? 'bg-emerald-100 text-emerald-700'
        : bg === 'warning'
          ? cn('bg-amber-100', text === 'dark' ? 'text-amber-900' : 'text-amber-700')
          : bg === 'secondary'
            ? 'bg-slate-200 text-slate-700'
            : 'bg-slate-200 text-slate-700';
  return <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-semibold', pill ? 'rounded-full' : 'rounded-sm', bgClass, className)}>{children}</span>;
}

export function Alert({ variant, className, children }: CommonProps & { variant?: string }) {
  const variantClass = variant === 'danger' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-700';
  return <div className={cn('rounded-lg border p-3 text-sm', variantClass, className)}>{children}</div>;
}

type CardComponent = ((props: CommonProps) => ReactElement) & {
  Body: (props: CommonProps) => ReactElement;
  Header: (props: CommonProps) => ReactElement;
  Footer: (props: CommonProps) => ReactElement;
  Title: (props: CommonProps) => ReactElement;
  Subtitle: (props: CommonProps) => ReactElement;
  Text: (props: CommonProps) => ReactElement;
  Img: (props: { src?: string; alt?: string; className?: string; variant?: string }) => ReactElement;
};

export const Card: CardComponent = (({ className, children }: CommonProps) => (
  <div className={cn('rounded-xl border border-slate-200 bg-white shadow-xs', className)}>{children}</div>
)) as CardComponent;

Card.Body = ({ className, children }: CommonProps) => <div className={cn('p-4', className)}>{children}</div>;
Card.Header = ({ className, children }: CommonProps) => <div className={cn('border-b border-slate-200 p-4', className)}>{children}</div>;
Card.Footer = ({ className, children }: CommonProps) => <div className={cn('border-t border-slate-200 p-4', className)}>{children}</div>;
Card.Title = ({ className, children }: CommonProps) => <h5 className={cn('mb-2 text-lg font-semibold', className)}>{children}</h5>;
Card.Subtitle = ({ className, children }: CommonProps) => <h6 className={cn('text-sm text-slate-500', className)}>{children}</h6>;
Card.Text = ({ className, children }: CommonProps) => <p className={cn('text-sm text-slate-700', className)}>{children}</p>;
Card.Img = ({ src, alt = '', className }: { src?: string; alt?: string; className?: string; variant?: string }) => (
  <img src={src} alt={alt} className={cn('h-auto w-full rounded-t-xl object-cover', className)} />
);

export function Image({ src, alt = '', className, roundedCircle, fluid, width, height }: { src?: string; alt?: string; className?: string; roundedCircle?: boolean; fluid?: boolean; width?: string | number; height?: string | number }) {
  return <img src={src} alt={alt} width={width} height={height} className={cn(fluid && 'max-w-full', roundedCircle && 'rounded-full', className)} />;
}

const ModalContext = createContext<{ onHide?: () => void }>({});

type ModalComponent = ((props: CommonProps & { show?: boolean; onHide?: () => void; centered?: boolean; fullscreen?: boolean }) => ReactElement | null) & {
  Header: (props: CommonProps & { closeButton?: boolean }) => ReactElement;
  Title: (props: CommonProps) => ReactElement;
  Body: (props: CommonProps) => ReactElement;
  Footer: (props: CommonProps) => ReactElement;
};

export const Modal: ModalComponent = (({ show, onHide, className, children, centered, fullscreen }: CommonProps & { show?: boolean; onHide?: () => void; centered?: boolean; fullscreen?: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 p-4" onClick={onHide}>
      <div
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-white shadow-xl',
          fullscreen ? 'h-[95vh] max-w-7xl' : 'max-w-2xl',
          centered && 'my-auto',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalContext.Provider value={{ onHide }}>{children}</ModalContext.Provider>
      </div>
    </div>
  );
}) as ModalComponent;

Modal.Header = ({ className, children, closeButton }: CommonProps & { closeButton?: boolean }) => {
  const { onHide } = useContext(ModalContext);
  return (
    <div className={cn('flex items-center justify-between border-b border-slate-200 p-4', className)}>
      <div>{children}</div>
      {closeButton && (
        <button type="button" onClick={onHide} className="rounded-sm px-2 py-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
};
Modal.Title = ({ className, children }: CommonProps) => <h4 className={cn('text-base font-semibold', className)}>{children}</h4>;
Modal.Body = ({ className, children }: CommonProps) => <div className={cn('p-4', className)}>{children}</div>;
Modal.Footer = ({ className, children }: CommonProps) => <div className={cn('flex items-center justify-end gap-2 border-t border-slate-200 p-4', className)}>{children}</div>;

type TabProps = CommonProps & { eventKey: string; title: ReactNode };

export function Tab(_props: TabProps) {
  return null;
}

export function Tabs({ defaultActiveKey, activeKey, onSelect, className, children, fill, id }: CommonProps & { defaultActiveKey?: string; activeKey?: string; onSelect?: (k: string | null) => void; fill?: boolean; id?: string }) {
  const tabs = (Array.isArray(children) ? children : [children]).filter(Boolean) as ReactElement<TabProps>[];
  const initial = activeKey ?? defaultActiveKey ?? tabs[0]?.props?.eventKey;
  const [internalKey, setInternalKey] = useState<string | undefined>(initial);
  const selected = activeKey ?? internalKey;

  const current = useMemo(() => tabs.find((tab) => tab.props.eventKey === selected) ?? tabs[0], [tabs, selected]);

  return (
    <div id={id} className={className}>
      <div className={cn('mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-2', fill && 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3')}>
        {tabs.map((tab) => {
          const isActive = tab.props.eventKey === current?.props.eventKey;
          return (
            <button
              key={tab.props.eventKey}
              type="button"
              className={cn(
                'rounded-md px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100',
              )}
              onClick={() => {
                setInternalKey(tab.props.eventKey);
                onSelect?.(tab.props.eventKey);
              }}
            >
              {tab.props.title}
            </button>
          );
        })}
      </div>
      <div>{current?.props.children}</div>
    </div>
  );
}

type FormComponent = ((props: React.FormHTMLAttributes<HTMLFormElement> & { validated?: boolean }) => ReactElement) & {
  Group: (props: CommonProps & { controlId?: string }) => ReactElement;
  Label: (props: React.LabelHTMLAttributes<HTMLLabelElement>) => ReactElement;
  Control: ((props: any) => ReactElement) & { Feedback: (props: CommonProps) => ReactElement };
  Select: (props: React.SelectHTMLAttributes<HTMLSelectElement>) => ReactElement;
  Text: (props: CommonProps) => ReactElement;
  Check: (props: { type?: string; label?: ReactNode; checked?: boolean; onChange?: (e: any) => void; className?: string }) => ReactElement;
};

export const Form: FormComponent = ((props: React.FormHTMLAttributes<HTMLFormElement> & { validated?: boolean }) => {
  const { validated: _validated, ...rest } = props;
  return <form {...rest} />;
}) as FormComponent;
Form.Group = ({ className, children, controlId }: CommonProps & { controlId?: string }) => <div id={controlId} className={cn('mb-3', className)}>{children}</div>;
Form.Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props} className={cn('mb-1 block text-sm font-medium text-slate-700', props.className)} />;
const FormControl = (({ as, className, ...props }: any) => {
  if (as === 'textarea') {
    return <textarea {...props} className={cn('w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200', className)} />;
  }
  return <input {...props} className={cn('w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200', className)} />;
}) as FormComponent['Control'];
FormControl.Feedback = ({ className, children }: CommonProps) => <p className={cn('mt-1 text-xs text-emerald-700', className)}>{children}</p>;
Form.Control = FormControl;
Form.Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} className={cn('w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200', props.className)} />;
Form.Text = ({ className, children }: CommonProps) => <p className={cn('mt-1 text-xs text-slate-500', className)}>{children}</p>;
Form.Check = ({ type = 'checkbox', label, checked, onChange, className }: { type?: string; label?: ReactNode; checked?: boolean; onChange?: (e: any) => void; className?: string }) => (
  <label className={cn('inline-flex items-center gap-2 text-sm text-slate-700', className)}>
    <input type={type} checked={checked} onChange={onChange} className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500" />
    <span>{label}</span>
  </label>
);

export function Spinner({ className, as = 'div' }: { className?: string; as?: string; animation?: string; variant?: string; size?: string; role?: string; 'aria-hidden'?: boolean | string }) {
  const Component: any = as;
  return <Component className={cn('spinner-border inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-transparent', className)} />;
}

type ToastComponent = ((props: CommonProps & { show?: boolean; onClose?: () => void }) => ReactElement | null) & {
  Header: (props: CommonProps) => ReactElement;
  Body: (props: CommonProps) => ReactElement;
};

export const Toast: ToastComponent = (({ show, onClose, className, children }: CommonProps & { show?: boolean; onClose?: () => void }) => {
  if (!show) return null;
  return (
    <div className={cn('min-w-[280px] rounded-lg border border-slate-200 bg-white shadow-lg', className)}>
      <ModalContext.Provider value={{ onHide: onClose }}>{children}</ModalContext.Provider>
    </div>
  );
}) as ToastComponent;

Toast.Header = ({ className, children }: CommonProps) => {
  const { onHide } = useContext(ModalContext);
  return (
    <div className={cn('flex items-center justify-between border-b border-slate-200 px-3 py-2 text-sm', className)}>
      <div className="flex flex-1 items-center gap-2">{children}</div>
      <button type="button" onClick={onHide} className="rounded-sm px-1 text-slate-500 hover:bg-slate-100" aria-label="Close toast">
        ×
      </button>
    </div>
  );
};
Toast.Body = ({ className, children }: CommonProps) => <div className={cn('px-3 py-2 text-sm text-slate-700', className)}>{children}</div>;
