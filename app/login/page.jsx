import AuthForm from "../Components/AuthForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <AuthForm isLogin={true} />
      <div className="text-center mt-4">
        <Link href="/register" className="text-green-100 hover:underline">
          Don't have an account? Register here
        </Link>
      </div>
    </div>
  )
}

