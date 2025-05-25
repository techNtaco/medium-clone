import { useState } from "react";
import Quote from "../components/Quote";
import AuthForm from "../components/AuthForm";

const Auth = () => {
  // Optionally, can let AuthForm handle mode internally and remove mode state here
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-sky-50 to-amber-50">
      <div className="flex items-center justify-center">
        <AuthForm mode={mode} setMode={setMode} />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

export default Auth;
