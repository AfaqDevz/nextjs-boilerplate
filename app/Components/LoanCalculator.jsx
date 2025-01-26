"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Card from "./Card"
import { useAuth } from "../Context/authcontext"
import toast from "react-hot-toast"

const loanCategories = {
    "Wedding Loans": { subcategories: ["Valima", "Furniture", "Valima Food", "Jahez"], maxLoan: 500000, maxPeriod: 3 },
    "Home Construction Loans": { subcategories: ["Structure", "Finishing", "Loan"], maxLoan: 1000000, maxPeriod: 5 },
    "Business Startup Loans": {
        subcategories: ["Buy Stall", "Advance Rent for Shop", "Shop Assets", "Shop Machinery"],
        maxLoan: 1000000,
        maxPeriod: 5,
    },
    "Education Loans": { subcategories: ["University Fees", "Child Fees Loan"], maxLoan: 1000000, maxPeriod: 4 },
}

const LoanCalculator = () => {
    const [category, setCategory] = useState("")
    const [subcategory, setSubcategory] = useState("")
    const [initialDeposit, setInitialDeposit] = useState("")
    const [loanPeriod, setLoanPeriod] = useState("")
    const [loanBreakdown, setLoanBreakdown] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        const savedLoanData = localStorage.getItem("loanData")
        if (savedLoanData) {
            const parsedData = JSON.parse(savedLoanData)
            setCategory(parsedData.category || "")
            setSubcategory(parsedData.subcategory || "")
            setInitialDeposit(parsedData.initialDeposit || "")
            setLoanPeriod(parsedData.loanPeriod || "")
            setLoanBreakdown(parsedData.loanBreakdown || null)
        }

    }, [])

    const handleCalculate = () => {
        if (!category || !initialDeposit || !loanPeriod) {
            // alert("Please fill in all required fields.")
            toast.error('Please fill in all fields!');
            return
        }

        const selectedCategory = loanCategories[category]
        const deposit = Number.parseInt(initialDeposit)
        const period = Number.parseInt(loanPeriod)

        if (deposit >= selectedCategory.maxLoan) {
            // alert("Initial deposit cannot be greater than or equal to the maximum loan amount.")
            toast.error(`Initial deposit should be under ${selectedCategory.maxLoan}`);
            return
        }

        if (period > selectedCategory.maxPeriod) {
            // alert(`Loan period cannot exceed ${selectedCategory.maxPeriod} years.`)
            toast.error(`Loan period can be maximum ${selectedCategory.maxPeriod} years.`)
            return
        }

        const loanAmount = selectedCategory.maxLoan - deposit
        const monthlyPayment = loanAmount / (period * 12)

        const newLoanBreakdown = {
            loanAmount,
            monthlyPayment: monthlyPayment.toFixed(2),
        }

        setLoanBreakdown(newLoanBreakdown)

        const loanData = {
            category,
            subcategory,
            initialDeposit,
            loanPeriod,
            loanBreakdown: newLoanBreakdown,
        }
        localStorage.setItem("loanData", JSON.stringify(loanData))
    }

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6 text-center">Loan Calculator</h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-white" htmlFor="category">
                        Loan Category
                    </label>
                    <select
                        id="category"
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value)
                            setSubcategory("")
                        }}
                    >
                        <option value="">Select a category</option>
                        {Object.keys(loanCategories).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {category && (
                    <div>
                        <label className="block text-sm font-medium mb-1 text-white" htmlFor="subcategory">
                            Loan Subcategory
                        </label>
                        <select
                            id="subcategory"
                            className="w-full p-2 bg-green-600 rounded-md text-white"
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            disabled={!category}
                        >
                            <option value="">Select a subcategory</option>
                            {loanCategories[category].subcategories.map((subcat) => (
                                <option key={subcat} value={subcat}>
                                    {subcat}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1 text-white" htmlFor="initialDeposit">
                        Initial Deposit (PKR)
                    </label>
                    <input
                        id="initialDeposit"
                        type="number"
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                        value={initialDeposit}
                        onChange={(e) => setInitialDeposit(e.target.value)}
                        placeholder="Enter initial deposit"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-white" htmlFor="loanPeriod">
                        Loan Period (years)
                    </label>
                    <input
                        id="loanPeriod"
                        type="number"
                        className="w-full p-2 bg-green-600 rounded-md text-white"
                        value={loanPeriod}
                        onChange={(e) => setLoanPeriod(e.target.value)}
                        placeholder="Enter loan period"
                        max={category ? loanCategories[category].maxPeriod : ""}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={handleCalculate}
                        disabled={!category || !initialDeposit || !loanPeriod}
                    >
                        Calculate Loan
                    </button>
                </div>

                {loanBreakdown && (
                    <div>
                        <div className="mt-6 p-4 bg-green-600 rounded-lg">
                            <h2 className="text-xl font-semibold mb-2 text-white">Loan Breakdown</h2>
                            <p className="text-white">Loan Amount: PKR {loanBreakdown.loanAmount.toLocaleString()}</p>
                            <p className="text-white">Monthly Payment: PKR {loanBreakdown.monthlyPayment}</p>
                        </div>
                        <div className="mt-6">
                            {user ? (
                                <Link
                                    href="/loan-request"
                                    className="block w-full text-center bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Proceed with Loan Application
                                </Link>
                            ) : (
                                <Link
                                    href="/register"
                                    className="block w-full text-center bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Register to Apply for a Loan
                                </Link>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </Card>
    )
}

export default LoanCalculator

