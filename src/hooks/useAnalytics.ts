import { usePostHog } from "posthog-js/react";

export function useAnalytics() {
  const ph = usePostHog();

  return {
    track: (event: string, properties?: Record<string, unknown>) => {
      ph.capture(event, properties);
    },
  };
}
