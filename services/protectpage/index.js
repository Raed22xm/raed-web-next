import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useAuthGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("userData"); // adjust key
    if (!storedUser) {
      router.replace("/auth");
      return;
    }
    setReady(true);
  }, [router]);

  return ready;
}