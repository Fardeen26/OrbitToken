const Hero = () => {
    return (
        <div className="h-screen flex flex-col items-center dark:bg-black">
            <div className='flex flex-col items-center mt-44 p-0 transition-all bg-white dark:bg-black'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-8xl/none dark:text-white'>OrbitToken</h1>
                <p className='text-3xl mt-2 text-gray-700 dark:text-gray-300 tracking-tighter'>The Solana Wallet Adaptor that let you what you want to do with your SOL</p>
            </div>
        </div>
    )
}

export default Hero