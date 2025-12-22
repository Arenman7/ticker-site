import { redirect, RedirectType } from "next/navigation";

const Page = () => {
    return (
        redirect("/dashboard", RedirectType.replace)
    );
};