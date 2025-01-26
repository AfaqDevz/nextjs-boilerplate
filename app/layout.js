import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./Context/authcontext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Saylani Microfinance",
  description: "Empowering communities through Qarze Hasana program",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-green-500 to-green-700 text-white`}
      >
        <AuthProvider>
          <Toaster />
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

