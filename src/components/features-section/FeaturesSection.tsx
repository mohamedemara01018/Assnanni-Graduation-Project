import { features } from '@/constants/landingPageConstant'

function FeaturesSection() {
    return (
        <section className='py-16'>
            <div className='wrapper'>
                <div className='text-center mb-12 text-4xl'>
                    <h1>Why Choose Assnani</h1>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {
                        features.map((feature, idx) => {
                            return (
                                <div key={idx} className='bg-(--color-surface) shadow-sm p-4 rounded-lg border border-(--color-border) '>
                                    <div className='flex items-center justify-start gap-2 '>
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            {feature.icon("w-6 h-6 text-blue-600 dark:text-blue-400")}
                                        </div>
                                        <h3 className='text-(--color-text) text-xl'>{feature.title}</h3>
                                    </div>
                                    <p className='text-(--color-text-light) mt-4'>{feature.description}</p>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </section>
    )
}

export default FeaturesSection