import CardContainer from "./CardContainer"

const Hero = () => {
    return (
        <div className="">
            <div className='flex flex-col items-center p-5 mt-12'>
                <h1 className='text-9xl'>OrbitToken</h1>
                <p className='text-3xl'>The Solana Wallet that let you what you want to do with your SOL.</p>
            </div>
            <CardContainer />
        </div>
    )
}

export default Hero