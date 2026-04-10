"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { useAuth } from "@/context/authContext";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
    disable_session_recording: true,
  });
}

function PosthogIdentifier() {
  const { user } = useAuth();
  const ph = usePostHog();

  useEffect(() => {
    if (user) {
      ph.identify(user.uid, {
        email: user.email,
        name: user.displayName,
      });
    } else {
      ph.reset();
    }
  }, [user]);

  return null;
}

export function PosthogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PosthogIdentifier />
      {children}
    </PHProvider>
  );
}

