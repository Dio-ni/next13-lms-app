import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LogoutWithRedirect() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Если пользователя нет — значит вышли из аккаунта
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return <SignOutButton>Выйти</SignOutButton>;
}
