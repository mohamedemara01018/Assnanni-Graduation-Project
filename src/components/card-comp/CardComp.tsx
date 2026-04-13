import { type ReactNode } from 'react'

function CardComp({ children, shadowHover, classProbs }: { children: ReactNode, shadowHover?: boolean, classProbs?: string }) {
    return (
        <div className={`flex flex-col  items-start gap-6 p-6 bg-(--color-surface) border border-(--color-border) ${classProbs} rounded-md shadow ${shadowHover ? 'hover:shadow-md' : ''} w-full h-fit transition duration-150`}>
            {children}
        </div>
    )
}

export default CardComp