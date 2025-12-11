import { Link } from "react-router";
interface FooterColumnProps {
    title: string,
    links: {
        name: string,
        path: string
    }[]
}
function FooterColumn({ title, links }: FooterColumnProps) {
    return (
        <div>
            <h4 className="mb-4 text-(--color-surface)">{title}</h4>
            <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                {links.map((item, idx) => (
                    <li key={idx} >
                        <Link to={item.path} className="hover:text-gray-200 hover:dark:text-gray-700 hover:cursor-pointer transition duration-150">
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FooterColumn;