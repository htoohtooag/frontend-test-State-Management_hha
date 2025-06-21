"use client";

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.authReducer);
  // console.log(isAuthenticated)
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('login');
    } else {
      router.push('/dashboard');
    }
  }, [isAuthenticated]);

  return null;

}
