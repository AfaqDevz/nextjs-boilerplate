const Card = ({ children, className = "" }) => {
    return (
        <div className={`bg-green-300 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-6 ${className}`}>
            {children}
        </div>
    )
}

export default Card

