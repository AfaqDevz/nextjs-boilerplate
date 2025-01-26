import Link from "next/link"
import AuthForm from "../Components/AuthForm"

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto">
      <AuthForm isLogin={false} />
      <div className="text-center mt-4">
        <Link href="/login" className="text-green-100 hover:underline">
          Already have an account? Login here
        </Link>
      </div>
    </div>
  )
}

