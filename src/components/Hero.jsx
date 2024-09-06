import CardContainer from "./CardContainer"

const Hero = () => {
    return (
        <div className="pt-48 pb-60 flex flex-col items-center justify-center
        ">
            <div className='flex flex-col items-center p-5'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-8xl/none'>OrbitToken</h1>
                <p className='text-3xl mt-2 text-gray-700 tracking-tighter'>The Solana Wallet that let you what you want to do with your SOL</p>
            </div>
            {/* <CardContainer /> */}
        </div>
    )
}

export default Hero