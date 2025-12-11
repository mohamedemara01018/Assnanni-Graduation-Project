import { testimonials } from '@/constants/landingPageConstant'
import Stars from '../stars/Stars'

function TestimonialsSection() {
    return (
        <section className='py-16'>
            <div className='wrapper  '>
                <h1 className='text-4xl text-center mb-16'>What Our Users Say</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {
                        testimonials.map((testimonial, idx) => {
                            return (
                                <div key={idx} className='bg-(--color-surface) flex flex-col gap-4 shadow-sm rounded-lg p-8 border border-(--color-border)'>
                                    <Stars rating={testimonial.rating} className='text-amber-300 text-xl' />
                                    <p className='text-(--color-text-light)'>{testimonial.content}</p>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-15 h-15 rounded-full overflow-hidden mr-1'>
                                            <img src={testimonial.image} className='w-full h-full object-cover' alt="testimonial-image" />
                                        </div>
                                        <div>
                                            <h3 className='text-(--color-text)'>{testimonial.name}</h3>
                                            <p className='text-(--color-text-light) text-sm'>{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </section>
    )
}

export default TestimonialsSection