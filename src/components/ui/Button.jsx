// eslint-disable-next-line react/prop-types
const Button = ({ btnText, btnState, onStateText }) => {
    return (
        <button type="submit" className='dark:bg-white dark:text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base mt-5 px-3 py-[10px] w-full bg-black text-white border border-black rounded-lg hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:border-white dark:hover:text-white'>{btnState ? onStateText : btnText}</button>
    )
}

export default Button