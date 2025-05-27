import { useEffect, useState, } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Input from "./Input"
import { signupSchema, signinSchema } from "@teamaccess2024/medium-common"
import { API_BASE_URL } from "../utils/api"
import { useDispatch } from "react-redux"
import { setUser } from "../store/authSlice"

type Mode = "signin" | "signup"

interface AuthFormProps {
  mode: Mode
  setMode: React.Dispatch<React.SetStateAction<Mode>>
}

interface FieldErrors {
  [field: string]: string
}

const initialFormState = { username: "", email: "", password: "" }

const AuthForm: React.FC<AuthFormProps> = ({ mode, setMode }) => {
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setForm(initialFormState)
    setErrors({})
    setApiError("")
  }, [mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
  }

  const validate = () => {
    const result = mode === "signup"
      ? signupSchema.safeParse(form)
      : signinSchema.safeParse(form)

    if (!result.success) {
      const newErrors: { [key: string]: string } = {}
      for (const err of result.error.errors) {
        newErrors[err.path[0]] = err.message
      }
      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
  }

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
): Promise<void> => {
  e.preventDefault()
  setApiError('')
  setErrors({})
  if (!validate()) return

  setLoading(true)
  try {
    const url = `${API_BASE_URL}/api/v1/auth/${mode}`
    const payload =
      mode === 'signup'
        ? { username: form.username, email: form.email, password: form.password }
        : { email: form.email, password: form.password }

    const response = await axios.post(url, payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    // On signin, stash the token & user, then navigate
    if (mode === 'signin') {
      localStorage.setItem('token', response.data.token)
      dispatch(setUser(response.data.user))
      navigate('/home')
    } else {
      // On signup success, switch to signin mode
      setMode('signin')
    }

    setForm(initialFormState)
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const { data } = err.response as {
        data: { error: unknown }
      }

      // If error is a field‐level object:
      if (
        typeof data.error === 'object' &&
        data.error !== null &&
        !Array.isArray(data.error)
      ) {
        const fieldObj = data.error as Record<
          string,
          { _errors?: string[] }
        >
        const newFieldErrors: FieldErrors = {}
        for (const key in fieldObj) {
          newFieldErrors[key] =
            fieldObj[key]._errors?.[0] ?? 'Invalid value'
        }
        setErrors(newFieldErrors)
      } else if (typeof data.error === 'string') {
        setApiError(data.error)
      } else {
        setApiError('Unknown server error')
      }
    } else {
      setApiError('Network error, please try again.')
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl p-10 bg-white/80 border border-gray-200 rounded-2xl shadow-xl backdrop-blur-sm"
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </h2>
      <p className="text-gray-600 text-center mb-6 text-base">
        {mode === "signin"
          ? "Welcome back! Access your account."
          : "Join us and start sharing your voice."}
      </p>

      {apiError && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded text-sm text-center">
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
        placeholder="you@example.com"
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
        type="submit"
        disabled={loading}
        className={`mt-4 w-full py-2 rounded-xl text-white font-semibold text-base transition-all duration-200
          bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black
          focus:outline-none focus:ring-2 focus:ring-gray-300
          ${loading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
      </button>

      <div className="mt-6 text-center text-sm text-gray-600">
        {mode === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="text-blue-600 hover:underline font-medium"
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
              onClick={() => setMode("signin")}
              className="text-blue-600 hover:underline font-medium"
              disabled={loading}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </form>
  )
}

export default AuthForm
