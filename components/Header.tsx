"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import {
  BookOpen,
  BookMarkedIcon,
  UserCog,
  SwitchCamera,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { SearchInput } from "./SearchInput";

type Role = "student" | "teacher";

export default function Header() {
  const { isSignedIn } = useUser();
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();
  const pathname = usePathname();

useEffect(() => {
  if (isSignedIn) {
    let storedRole = localStorage.getItem("role") as Role | null;

    // If no role stored, default to student or fetch from DB/user metadata
    if (!storedRole) {
      storedRole = "student";
      localStorage.setItem("role", storedRole);
    }

    setRole(storedRole);
  }
}, [isSignedIn]);

  const handleChangeRole = () => {
    const newRole = role === "student" ? "teacher" : "student";
    setRole(newRole);
    localStorage.setItem("role", newRole);

    if (newRole === "student") {
      router.push("/my-courses");
    } else if (newRole === "teacher") {
      router.push("/teacher/courses");
    }
  };

  const Logo = () => (
    <Link
      href="/"
      prefetch={false}
      className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
    >
      <BookOpen className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
        Courselly
      </span>
    </Link>
  );

  const NavLink = ({
    href,
    label,
  }: {
    href: string;
    label: string;
  }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`text-sm font-medium transition-colors ${
          isActive
            ? "text-foreground border-b-2 border-primary pb-1"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {label}
      </Link>
    );
  };

  const GuestNav = () => (
    <nav className="flex gap-4 items-center">
      <NavLink href="/" label="Курстар" />
      <NavLink href="/instruction" label="Нұсқаулық " />
    </nav>
  );

  const StudentNav = () => (
    <nav className="flex gap-4 items-center">
      <NavLink href="/" label="Басты бет" />
      
      <NavLink href="/courses-list" label="Барлық курстар" />
      <NavLink href="/my-courses" label="Менің курстарым" />
      
      <NavLink href="/instruction" label="Нұсқаулық " />
      <NavLink href="/about-course" label="ЖАОК " />
    </nav>
  );

  const TeacherNav = () => (
    <nav className="flex gap-4 items-center">
      <NavLink href="/" label="Басты бет" />
      <NavLink href="/teacher/courses" label="Менің курстарым" />
      <NavLink href="/instruction" label="Нұсқаулық " />
      <NavLink href="/about-course" label="ЖАОК " />
    </nav>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="flex-1 flex justify-center">
            <SignedOut>
              <GuestNav />
            </SignedOut>
            <SignedIn>
                {role ? (
                  role === "student" ? <StudentNav /> : <TeacherNav />
                ) : null}
              </SignedIn>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline">Кіру</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {isSignedIn && role === "student" && <SearchInput />}

              {role && (
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                    <UserCog className="w-4 h-4" />
                    {role === "student" ? "Студент" : "Мұғалім"}
                    
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleChangeRole}>
                    <SwitchCamera className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
