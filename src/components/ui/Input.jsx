// eslint-disable-next-line react/prop-types
const Input = ({ placeholder, value, setter, type }) => {
    return (
        <input
            type={type}
            className="transition-all dark:border-white flex h-9 w-full max-sm:w-[85vw] rounded-md border border-black bg-transparent px-3 py-1 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setter(e.target.value)}
        />
    )
}

export default Input