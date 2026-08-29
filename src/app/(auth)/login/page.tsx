"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { loginRequest, verify2FA, resend2FA } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import AuthSplitLayout from "@/components/shared/AuthSplitLayout";
import TurnstileWidget from '@/components/shared/TurnstileWidget'
import SecurityChallenge from "@/components/shared/SecurityChallenge";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [turnstileToken, setTurnstileToken] = useState('')

  const [stage, setStage] = useState<"credentials" | "code">("credentials");
  const [pendingToken, setPendingToken] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [code, setCode] = useState("");
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginRequest({
        email,
        password,
        challenge_token: challengeToken,
        challenge_answer: challengeAnswer,
        turnstile_token: turnstileToken,
      });
      setPendingToken(data.pending_token);
      setEmailHint(data.email_hint);
      setStage("code");
      toast.success(`Verification code sent to ${data.email_hint}`);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    setResending(true);
    try {
      await resend2FA(pendingToken);
      toast.success("A new code has been sent to your email");
      setCode("");
      setResendCooldown(60);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to resend code";
      toast.error(message);
      if (message.toLowerCase().includes("log in again")) {
        setStage("credentials");
      }
    } finally {
      setResending(false);
    }
  }

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await verify2FA(pendingToken, code);
      setAuth(data.token, data.member);
      toast.success(`Welcome back, ${data.member.name.split(" ")[0]}`);

      const roleName = data.member.role;
      if (roleName === "cashier" || roleName === "sales") {
        router.push("/new-sale");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid or expired code";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (stage === "code") {
    return (
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-gray-900">
          Enter verification code
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-8">
          We sent a 6-digit code to {emailHint}
        </p>

        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Verification Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              autoFocus
              className="w-full px-3.5 py-3 border border-gray-300 rounded-lg text-center text-2xl
                         tracking-[0.5em] font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                       hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify and sign in"}
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setStage("credentials")}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to login
            </button>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending || resendCooldown > 0}
              className="text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : resending
                  ? "Sending..."
                  : "Resend code"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="lg:hidden flex flex-col items-center mb-8">
        <Link href="/" className="mb-4">
          <img
            src="/logo.png"
            alt="PapoPOS"
            className="w-12 h-12 rounded-xl object-contain"
          />
        </Link>
      </div>

      <h1 className="text-xl font-semibold text-gray-900">
        Sign in to your account
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">
        Enter your details to access the POS system
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="youremail@gmail.com"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       placeholder:text-gray-400"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         placeholder:text-gray-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <TurnstileWidget onVerify={setTurnstileToken} />
        <SecurityChallenge
          onChange={(token, answer) => {
            setChallengeToken(token);
            setChallengeAnswer(answer);
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60
                     disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Start free trial
        </Link>
      </p>

      <p className="text-center text-xs text-gray-400 mt-2">
        PapoPOS, Secure Business Management
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
