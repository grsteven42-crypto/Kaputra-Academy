import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}