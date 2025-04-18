"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { BookOpen, BookMarkedIcon, UserCog, SwitchCamera } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { SearchInput } from "./SearchInput";

type Role = "student" | "teacher";

export default function Header() {
  const { isSignedIn } = useUser();
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      const storedRole = localStorage.getItem("role") as Role | null;
      setRole(storedRole);
    }
  }, [isSignedIn]);

  const handleChangeRole = () => {
    const newRole = role === "student" ? "teacher" : "student";
    setRole(newRole);
    localStorage.setItem("role", newRole);

    // Redirect after role change
    if (newRole === "student") {
      router.push("/courses");
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

  const GuestNav = () => (
    <nav>
      <Link
        href="/courses"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Courses
      </Link>
    </nav>
  );

  const StudentNav = () => (
    <nav className="flex gap-4 items-center">
      <Link href="/courses" className="nav-link">All Courses</Link>
      <Link href="/mycourses" className="nav-link">My Courses</Link>
    </nav>
  );

  const TeacherNav = () => (
    <nav className="flex gap-4 items-center">
      <Link href="/teacher/mycourses" className="nav-link">Teaching</Link>
    </nav>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            {isSignedIn && role === "student" && <SearchInput />}
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <GuestNav />
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {role === "student" && <StudentNav />}
              {role === "teacher" && <TeacherNav />}

              {role && (
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                    <UserCog className="w-4 h-4" />
                    {role}
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
