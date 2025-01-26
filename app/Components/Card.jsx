const Card = ({ children, className = "" }) => {
    return (
        <div className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-6 ${className}`}>
            {children}
        </div>
    )
}

export default Card

