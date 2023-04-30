import React from 'react'

function JoinForm({ onSubmitJoin, setjoinhomeId }) {
    return (
        <div className="bg-white rounded-lg p-4">
            <form onSubmit={onSubmitJoin}>
                <div className="flex flex-col mb-4">
                    <label htmlFor="homeid" className="text-gray-700 font-medium mb-2">
                        Home ID
                    </label>
                    <input
                        type="text"
                        id="homeid"
                        name="homeid"
                        placeholder="Enter home ID"
                        onChange={(e) => setjoinhomeId(e.currentTarget.value)}
                        className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700"
                >
                    Join
                </button>
            </form>
        </div>

    );
}

export default JoinForm
