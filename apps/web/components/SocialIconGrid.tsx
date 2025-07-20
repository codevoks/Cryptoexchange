import { Handles, SocialMediaHandle } from "@repo/types/footerTypes"
import { footerColumnTitleStyle } from "../styles/footerColumn/footerColumnStyle"


export default function SocialIconGrid({Handles}: Handles){
    return (
        <div className="">
            <div className={footerColumnTitleStyle}>
                Community
            </div>
            <div className="grid justify-center grid-cols-4 gap-2">
                {Handles.map((SocialMediaHandle: SocialMediaHandle) => (
                    <a href={SocialMediaHandle.link} key={SocialMediaHandle.label} target="_blank" rel="noopener noreferrer" className="text-gray-400 transition hover:text-accent-hover">
                        <SocialMediaHandle.icon size={28} />
                    </a>
                ))}
            </div>
        </div>
    )
}