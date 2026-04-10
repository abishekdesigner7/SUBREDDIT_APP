interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <span
      className={`inline-block text-xs font-semibold tracking-widest uppercase text-[#FF4500] mb-3 ${className}`}
    >
      {children}
    </span>
  );
}
