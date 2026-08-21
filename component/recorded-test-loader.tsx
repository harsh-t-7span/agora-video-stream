"use client";

import dynamic from "next/dynamic";

const RecordedTest = dynamic(() => import("@/component/recorded-test"), {
  ssr: false,
  loading: () => (
    <p className="flex min-h-screen items-center justify-center bg-black text-white">
      Loading recorded test...
    </p>
  ),
});

export function RecordedTestLoader() {
  return <RecordedTest />;
}
