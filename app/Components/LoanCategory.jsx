import Link from "next/link";

const LoanCategory = ({ name, icon, subcategories, maxLoan, period }) => {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">{icon}</span>
                <h2 className="text-2xl font-bold text-green-800">{name}</h2>
            </div>
            <ul className="list-disc list-inside mb-4 text-green-700 space-y-1">
                {subcategories.map((subcategory, index) => (
                    <li key={index} className="text-sm">
                        {subcategory}
                    </li>
                ))}
            </ul>
            <div className="mb-4">
                <p className="text-green-600 font-semibold">
                    Maximum loan: <span className="text-green-800">{maxLoan}</span>
                </p>
                <p className="text-green-600 font-semibold">
                    Loan period: <span className="text-green-800">{period}</span>
                </p>
            </div>
            <div className="flex justify-end">
                <Link
                    href="/calculator"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Calculate Loan
                </Link>
            </div>
        </div>
    );
};

export default LoanCategory;
