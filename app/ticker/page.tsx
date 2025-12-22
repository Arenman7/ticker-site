import { redirect, RedirectType } from "next/navigation";

const TickerPage = () => {
    return (
        redirect("/dashboard", RedirectType.replace)
    );
};

export default TickerPage;