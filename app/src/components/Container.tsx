interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={`px-4 md:px-8 lg:px-12 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  );
}
