import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", className)}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={cn("p-6 pb-3", className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
    return <h3 className={cn("text-xl font-bold text-gray-900", className)}>{children}</h3>
}

export function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={cn("p-6 pt-3", className)}>{children}</div>
}
