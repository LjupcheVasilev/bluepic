"use client";

import { Home, Search, PlusSquare, Heart, User, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useSession from "@/hooks/useSession";
import { useEffect, useState } from "react";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const Navigation = () => {
  const { session, isLoading } = useSession();
  const [navigation, setNavigation] = useState<NavItem[]>([]);
  const pathname = usePathname();

  const loggedInNav: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Create", href: "/create", icon: PlusSquare },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Logout", href: "/api/auth/logout", icon: LogOut },
  ];

  const loggedOutNav: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Login", href: "/login", icon: LogIn },
  ];

  useEffect(() => {
    setNavigation(
      !isLoading && session.did && session.did !== "" ? loggedInNav : loggedOutNav
    );

  }, [isLoading, session]);

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t bg-background p-4 backdrop-blur-lg md:bottom-auto md:top-0 md:border-b md:border-t-0 md:h-auto">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="hidden md:block">
          <h1 className="text-xl font-bold">Instagram Clone</h1>
        </Link>
        <div className="flex w-full items-center justify-around md:w-auto md:gap-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex flex-col items-center gap-1 p-2 transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs md:hidden">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
