import { useEffect, useState } from "react";
import axios from "axios";
import Input from "./Input";
import { signupSchema, signinSchema } from '@teamaccess2024/medium-common';
import { API_BASE_URL } from "../utils/api";

type Mode = "signin" | "signup";

interface AuthFormProps {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const initialFormState = { username: "", email: "", password: "" };

const AuthForm: React.FC<AuthFormProps> = ({ mode, setMode }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setForm(initialFormState);
    setErrors({});
    setApiError("");
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    let result;
    if (mode === "signup") {
      result = signupSchema.safeParse({
        username: form.username,
        email: form.email,
        password: form.password,
      });
    } else {
      result = signinSchema.safeParse({
        email: form.email,
        password: form.password,
      });
    }
    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      for (const err of result.error.errors) {
        newErrors[err.path[0]] = err.message;
      }
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const url = `${API_BASE_URL}/${mode}`;
      const payload =
        mode === "signup"
          ? {
              username: form.username,
              email: form.email,
              password: form.password,
            }
          : {
              email: form.email,
              password: form.password,
            };

      const response = await axios.post(url, payload, {
        // withCredentials: true,
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      });

      const { status, data } = response;

      if (status < 200 || status >= 300) {
        if (data.error && typeof data.error === "object" && !Array.isArray(data.error)) {
          const fieldErrors: Record<string, string> = {};
          for (const key in data.error) {
            fieldErrors[key] = data.error[key]._errors?.[0] || "Invalid value";
          }
          setErrors(fieldErrors);
        } else {
          setApiError(data.error || "Unknown error");
        }
        setLoading(false);
        return;
      }

      alert(data.message || "Success!");
      setForm(initialFormState);

    } catch {
      setApiError("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-md bg-white/90 shadow-xl rounded-3xl p-10 backdrop-blur border border-slate-100"
      onSubmit={handleSubmit}
    >
      <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight text-center font-serif">
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </h2>
      <p className="text-slate-500 mb-6 text-center text-lg">
        {mode === "signin"
          ? "Welcome back! Sign in to your blogging journey."
          : "Create your account and start sharing your stories."}
      </p>
      {apiError && (
        <div className="mb-4 text-amber-600 bg-amber-50 px-3 py-2 rounded text-center">
          {apiError}
        </div>
      )}
      {mode === "signup" && (
        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
          disabled={loading}
          placeholder="Your username"
        />
      )}
      <Input
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        type="email"
        autoComplete="email"
        disabled={loading}
        placeholder="you@email.com"
      />
      <Input
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        disabled={loading}
        placeholder="••••••••"
      />
      <button
        className={`mt-2 w-full py-2 rounded-xl font-bold text-lg
          bg-gradient-to-r from-sky-500 to-amber-400
          text-white shadow hover:from-sky-600 hover:to-amber-500
          focus:outline-none focus:ring-2 focus:ring-sky-200
          transition-all duration-150
          ${loading ? "opacity-60 cursor-not-allowed" : ""}
        `}
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Loading..."
          : mode === "signin"
          ? "Sign In"
          : "Sign Up"}
      </button>
      <div className="mt-6 text-center text-base text-slate-600">
        {mode === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="text-sky-600 hover:text-amber-500 underline font-semibold"
              onClick={() => setMode("signup")}
              disabled={loading}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="text-sky-600 hover:text-amber-500 underline font-semibold"
              onClick={() => setMode("signin")}
              disabled={loading}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
