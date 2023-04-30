import React from 'react'

function CreateForm({ onSubmitCreate,setHomeName,addMember,handleMemberChange,removeMember }) {


    return (
        <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Create Home</h2>
            <form onSubmit={onSubmitCreate}>
                <label className="block mb-2 font-bold text-sm text-gray-800" htmlFor="homeName">
                    Home Name
                </label>
                <input
                    type="text"
                    id="homeName"
                    name="homeName"
                    value={homeName}
                    onChange={(event) => setHomeName(event.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                />
                {members.map((member, index) => (
                    <div className="mt-4" key={index}>
                        <p className='block mb-2 font-bold text-sm text-gray-800'>
                            Member {index + 1}
                            <button
                                className="ml-2 text-red-500"
                                onClick={() => removeMember(index)}
                            >
                                x
                            </button>
                        </p>
                        <input
                            type="text"
                            id={`memberName${index}`}
                            name="name"
                            placeholder='Name'
                            value={member.name}
                            onChange={(event) => handleMemberChange(event, index)}
                            className="w-full px-3 py-2 mb-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />

                        <input
                            type="email"
                            id={`memberEmail${index}`}
                            name="email"
                            placeholder='Email'
                            value={member.email}
                            onChange={(event) => handleMemberChange(event, index)}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                ))}

                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                        onClick={addMember}
                    >
                        Add Member
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Create Home
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateForm
