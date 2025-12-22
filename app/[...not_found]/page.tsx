import { redirect, RedirectType } from "next/navigation";

const NotFound = () => {
    return (
        redirect("/dashboard", RedirectType.replace)
    );
};

export default NotFound;