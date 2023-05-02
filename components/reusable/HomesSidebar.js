import { useContext, useEffect, useState } from "react";


import { ThemeContext } from '../ThemeProvider';

export default function HomesSidebar({ homes }) {
    const { isDark, toggleTheme, theme } = useContext(ThemeContext);

    const [expandedHomeId, setExpandedHomeId] = useState(null);

    const toggleExpandedHome = (homeId) => {
        setExpandedHomeId((prevExpandedHomeId) =>
            prevExpandedHomeId === homeId ? null : homeId
        );
    };

    return (
        <div className={`grid gap-1 grid-cols-1 ${theme.boxbg}`}>
            <h2 className={`${theme.primaryTextColor} text-2xl py-3 font-bold ml-4`}>Homes</h2>
            {homes.map((home) => (
                <div key={home._id} className={`rounded-lg ${theme.boxbg}`}>
                    <button
                        className={`w-full px-4 py-2 flex items-center justify-between ${theme.primaryTextColor}`}
                        onClick={() => toggleExpandedHome(home._id)}
                    >
                        <h3 className={`text-md font-bold ${theme.primaryTextColor}`}>{home.name}</h3>
                        {expandedHomeId === home._id ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 ${theme.primaryTextColor}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 ${theme.primaryTextColor}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        )}
                    </button>
                    {expandedHomeId === home._id && (
                        <div className={`p-4 ${theme.primaryTextColor} border `}>
                            <p className={`text-gray-500 ${theme.secondaryTextColor}`}> Owner</p>
                            <p>{home.owner.name}</p><br />

                            <p className={`text-gray-500 ${theme.secondaryTextColor}`}> Members</p>
                            <ul>
                                {home.invitedusers.map((inviteduser) => (
                                    <li key={inviteduser.id} className={theme.primaryTextColor}>
                                        {inviteduser.name}
                                        {inviteduser.status === 'pending' && (
                                            <span className={`text-xs ${theme.secondaryTextColor} ml-1`}>(pending)</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>

    );
}
