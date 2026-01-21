import SignIn from "@/app/components/auth/SignIn";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <SignIn />
    </main>
  );
}