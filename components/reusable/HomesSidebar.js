import { useEffect, useState } from "react";


export default function HomesSidebar({ homes }) {
    const [expandedHomeId, setExpandedHomeId] = useState(null);

    const toggleExpandedHome = (homeId) => {
        setExpandedHomeId((prevExpandedHomeId) =>
            prevExpandedHomeId === homeId ? null : homeId
        );
    };

    return (
        <div className="grid gap-1 grid-cols-1 ">
            {homes.map((home) => (
                <div key={home._id} className="bg-white rounded-lg shadow-lg">
                    <button
                        className="w-full px-4 py-2 flex items-center justify-between"
                        onClick={() => toggleExpandedHome(home._id)}
                    >
                        <h3 className="text-lg font-bold">{home.name}</h3>
                        {expandedHomeId === home._id ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        )}
                    </button>
                    {expandedHomeId === home._id && (
                        <div className="p-4" key={home._id}>
                            <p className="text-gray-500">{home.invitedusers.length} Members</p>
                            <ul>
                                {home.invitedusers.map((inviteduser) => (
                                    <li key={inviteduser.id}>
                                        {inviteduser.name}
                                        {inviteduser.status === 'pending' && (
                                            <span className="text-xs text-gray-400 ml-1">(pending)</span>
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
