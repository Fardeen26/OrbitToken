// eslint-disable-next-line react/prop-types
const Input = ({ placeholder, value, setter }) => {
    return (
        <input
            type='text'
            className="flex h-9 w-full rounded-md border border-black bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setter(e.target.value)}
        />
    )
}

export default Input