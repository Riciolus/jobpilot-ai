"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingTransitionPage() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // trigger fade-out
    }, 2000); // keep it visible for 2s

    const finalRedirect = setTimeout(() => {
      router.replace("/chat");
    }, 2500); // redirect after fade-out

    return () => {
      clearTimeout(timer);
      clearTimeout(finalRedirect);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-4 text-6xl">🤔</div>
            <h1 className="text-xl font-semibold text-slate-100">
              We&apos;re thinking for you...
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Setting up your personalized experience
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
