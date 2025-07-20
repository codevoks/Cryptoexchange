import {
    FaXTwitter,
    FaYoutube,
    FaRedditAlien,
    FaDiscord,
    FaEnvelope,
    FaInstagram,
    FaFacebook,
    FaLinkedin
  } from "react-icons/fa6";

import {
    FaTelegramPlane
} from "react-icons/fa"

import { FooterColumn, SocialMediaHandle } from "../types/footer";


export const FooterColumnData : FooterColumn[] = [
    {
        title:"Company",
        content:[
            {label:"About us",href:"#"},
            {label:"Careers",href:"#"},
            {label:"Partners",href:"#"},
            {label:"News",href:"#"}
        ]
    },
    {
        title:"Product",
        content:[
            {label:"Spot",href:"#"},
            {label:"Futures",href:"#"},
            {label:"Earn",href:"#"},
            {label:"LaunchPad",href:"#"},
            {label:"NFT",href:"#"},
            {label:"API",href:"#"}
        ]
    },
    {
        title:"Service",
        content:[
            {label:"Fees",href:"#"},
            {label:"Bug Bounty",href:"#"},
            {label:"User Agreement",href:"#"},
            {label:"Affiliate",href:"#"},
            {label:"Referral",href:"#"}
        ]
    },
    {
        title:"Support",
        content:[
            {label:"Help Center",href:"#"},
            {label:"Apply to List",href:"#"},
            {label:"Marketing Corporation",href:"#"},
            {label:"Contact Support",href:"#"},
            {label:"Product Feedback",href:"#"},
            {label:"Online Verification",href:"#"}
        ]
    }
]

export const SocialMediaData: SocialMediaHandle[] = [
    { icon: FaXTwitter, link:"#", label:"X"},
    { icon: FaYoutube, link:"#", label:"YouTube"},
    { icon: FaRedditAlien, link:"#", label:"Reddit"},
    { icon: FaDiscord, link:"#", label:"Discord"},
    { icon: FaEnvelope, link:"#", label:"Email"},
    { icon: FaInstagram, link:"#", label:"Instagram"},
    { icon: FaFacebook, link:"#", label:"Facebook"},
    { icon: FaLinkedin, link:"#", label:"Linkedin"},
    { icon: FaTelegramPlane, link:"#", label:"Telegram"}
]