import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => (
  <div className="mb-5">
    <label className="block mb-2 font-semibold text-slate-700">{label}</label>
    <input
      className={`
        w-full px-4 py-2 rounded-xl border bg-slate-50 text-base text-slate-800
        outline-none transition 
        focus:border-sky-400 focus:ring-2 focus:ring-sky-100
        ${error ? "border-amber-500" : "border-slate-200"}
      `}
      {...props}
    />
    {error && (
      <span className="text-xs text-amber-600 mt-1 block">{error}</span>
    )}
  </div>
);

export default Input;
