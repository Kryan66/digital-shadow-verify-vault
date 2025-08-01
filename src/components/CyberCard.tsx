
import { cn } from "@/lib/utils";

interface CyberCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const CyberCard = ({ title, children, className }: CyberCardProps) => {
  return (
    <div className={cn(
      "cyber-panel p-6 relative overflow-hidden",
      className
    )}>
      {title && (
        <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-purple to-transparent animate-pulse-glow" />
      )}
      {title && (
        <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default CyberCard;
