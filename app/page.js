import LoanCategory from "./Components/LoanCategory";

const loanCategories = [
  {
    name: "Wedding Loans",
    icon: "💍",
    subcategories: ["Valima", "Furniture", "Valima Food", "Jahez"],
    maxLoan: "5 Lakh",
    period: "3 years",
  },
  {
    name: "Home Construction Loans",
    icon: "🏠",
    subcategories: ["Structure", "Finishing", "Loan"],
    maxLoan: "10 Lakh",
    period: "5 years",
  },
  {
    name: "Business Startup Loans",
    icon: "💼",
    subcategories: ["Buy Stall", "Advance Rent for Shop", "Shop Assets", "Shop Machinery"],
    maxLoan: "10 Lakh",
    period: "5 years",
  },
  {
    name: "Education Loans",
    icon: "🎓",
    subcategories: ["University Fees", "Child Fees Loan"],
    maxLoan: "Based on requirement",
    period: "4 years",
  },
];

export default function Home() {
  return (
    <>
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">Welcome to Saylani Microfinance</h1>
          <p className="text-xl text-white">
            Halal Loans from Saylani Mass It Trainings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loanCategories.map((category) => (
            <LoanCategory key={category.name} {...category} />
          ))}
        </div>

        <div className="text-center">
          <p className="text-white mb-4">
            At Saylani Microfinance, we believe in providing financial support to those who need it most. Our Qarze Hasana
            program offers interest-free loans to help you achieve your goals.
          </p>
        </div>
      </div>
    </>
  );
}
