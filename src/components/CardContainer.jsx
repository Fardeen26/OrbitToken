import { Link } from 'react-router-dom'
import Card from './Card'

const CardContainer = () => {
    return (
        <div className='p-5 flex gap-10 justify-center mt-12'>
            <Link to={'/transaction'}>
                <Card title={"Send SOLANA"} />
            </Link>
            <Link to={'/token'}>
                <Card title={"Transfer Tokens"} />
            </Link>
            <Link to={'/account'}>
                <Card title={"Get Your Wallet Info"} />
            </Link>
        </div>
    )
}

export default CardContainer