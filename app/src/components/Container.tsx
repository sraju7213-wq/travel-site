interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Opts into the wide 7xl shell used by dense workspaces (package detail). */
  wide?: boolean;
}

export default function Container({ children, className, wide = false }: ContainerProps) {
  return (
    <div
      className={`px-4 md:px-8 lg:px-12 ${wide ? "max-w-7xl" : "max-w-5xl"} mx-auto ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
