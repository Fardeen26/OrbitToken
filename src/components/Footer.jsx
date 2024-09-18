const Footer = () => {
    return (
        <div className='flex items-center justify-between px-5 pb-3 transition-all bg-white text-black dark:bg-black dark:text-white'>
            <div className="text-xs pt-0">Made by <a href="https://x.com/fardeen14693425" target="_blank" className='underline'>Fardeen</a> </div>
            <div className="flex pt-0 text-xs gap-2">
                <a href="https://x.com/fardeen14693425" target="_blank" className='underline'>Twitter</a>
                <a href="https://github.com/Fardeen26/" target="_blank" className='underline'>GitHub</a>
                <a href="https://www.linkedin.com/in/fardeenmansoori/" target="_blank" className='underline'>LinkedIn</a>
            </div>
        </div>
    )
}

export default Footer