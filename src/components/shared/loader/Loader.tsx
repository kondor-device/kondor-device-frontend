interface LoaderProps {
  className?: string;
}

export default function Loader({ className = "h-[700px]" }: LoaderProps) {
  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <div className="loader"></div>
    </div>
  );
}
