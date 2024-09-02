import Card from './Card'

const CardContainer = () => {
    return (
        <div className='p-5 flex gap-10 justify-center mt-12'>
            <Card />
            <Card />
            <Card />
        </div>
    )
}

export default CardContainer