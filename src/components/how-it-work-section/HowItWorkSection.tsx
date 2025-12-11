import { howItWorks } from '@/constants/landingPageConstant'


function HowItWorkSection() {
    return (
        <section className='bg-(--color-surface) py-16 '>
            <div className='wrapper'>
                <div className='text-center text-4xl'>
                    <h1>How It Works</h1>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16'>
                    {
                        howItWorks.map((item, idx) => {
                            return (
                                <div key={idx} className='flex flex-col items-center gap-2'>
                                    <h2 className='bg-(--color-primary) text-white w-15 h-15 rounded-full flex items-center justify-center text-2xl'>
                                        {item.step}
                                    </h2>
                                    <h3 className='text-(--color-text) text-xl'> {item.title}</h3>
                                    <p className='text-(--color-text-light) text-center'>{item.description}</p>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </section>
    )
}

export default HowItWorkSection