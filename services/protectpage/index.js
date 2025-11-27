import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useAuthGuard() {
  const router = useRouter();
  const [ready] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem("userData"));
  });

  useEffect(() => {
    if (!ready) {
      router.replace("/auth");
    }
  }, [ready, router]);

  return ready;
}
