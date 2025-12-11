
import { FaStar } from 'react-icons/fa'

interface starsProps {
    rating: Number,
    className: string,
}
function Stars({ rating, className }: starsProps) {
    return (
        <div className='flex items-center gap-2'>
            {
                Array.from({ length: Number(rating) }).map((_, idx) => {
                    return (
                        <FaStar key={idx} className={className} />
                    )
                })
            }

        </div>
    )
}

export default Stars