import Link from "next/link";
import NavLink from "./NavLink";

export default function Links() {

    const links = [
    {title : "Home", path : "/"},
    {title : "Teams", path : "/teams"},
    {title : "Tournaments", path : "/tournaments"},
    ];

    return (
        <div>
            {links.map((link) => (
                  <NavLink link={link} key={link.title} />
                )
            )}
        </div>
    )
}
