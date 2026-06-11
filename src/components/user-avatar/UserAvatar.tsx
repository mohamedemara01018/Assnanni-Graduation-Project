import { User } from "lucide-react";
import { useState } from "react";

const UserAvatar = ({ src, alt }: { src: string; alt: string }) => {
    const [imageError, setImageError] = useState(false);

    if (src?.trim() && !imageError) {
        return (
            <img
                src={src}
                className="object-cover w-full h-full"
                alt={alt || "user image"}
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <div className="w-full h-full bg-(--color-bg-blue) border border-(--color-primary)/20 flex items-center justify-center">
            <User className="w-5 h-5 text-(--color-primary)" />
        </div>
    );
};

export default UserAvatar