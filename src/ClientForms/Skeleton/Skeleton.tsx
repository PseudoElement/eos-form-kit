import React from "react";
function Skeleton() {
    return (
        <div style={{ position: "absolute", zIndex: 100, background: "rgba(245,245,245,0.75)", height: "600px", paddingTop: "100px" }}>
            {/* <img src={skelet} alt="" /> */}
            <svg width="800" height="500" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H800V500H0V0Z" fill="white" fillOpacity="0.5" />
                <path fillRule="evenodd" clipRule="evenodd" d="M784 214H16V246H784V214ZM384 280H16V312H384V280ZM16 346H384V378H16V346ZM16 82H186V114H16V82ZM586 82H416V114H586V82ZM384 82H214V114H384V82ZM784 82H614V114H784V82ZM416 346H784V378H416V346ZM784 280H416V312H784V280ZM784 412H16V444H784V412Z" fill="#E7EBF1" />
                <path d="M384 8H16V40H384V8Z" fill="#E7EBF1" />
                <path d="M384 148H16V180H384V148Z" fill="#E7EBF1" />
                <path d="M784 148H416V180H784V148Z" fill="#E7EBF1" />
                <rect width="800" height="500" fill="url(#paint0_linear)" />
                <defs>
                    <linearGradient id="paint0_linear" x1="400" y1="0" x2="400" y2="500" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0" />
                        <stop offset="1" stopColor="white" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
export default Skeleton;