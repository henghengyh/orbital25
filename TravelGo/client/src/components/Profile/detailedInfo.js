import { PencilIcon } from '@heroicons/react/24/solid';

function detailedInfo({ user, onEditField }) {
    const editButton = (fieldKey) => {
        return <button
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none"
                    onClick={() => onEditField(fieldKey)}
                    aria-label="Edit"
                ><PencilIcon className="w-3 h-3" /></button>
    }
    const entry = (fieldName, fieldKey) => {
        return (
            <>
                <span className="col-span-2">{fieldName}</span>
                <span className="col-start-3 col-span-6">
                    <div className="flex grid grid-cols-6 items-center">
                        <span className="col-start-1 col-span-5">
                            {user[fieldKey] ? user[fieldKey] : "NA"}
                        </span>
                        <span className="col-start-6 col-span-1">{editButton(fieldKey)}</span>
                    </div>
                </span>
            </>
        )
    }

    const sensitiveEntry = (fieldName, fieldKey) => {
        return (
            <>
                <span className="col-span-2">{fieldName}</span>
                <span className="col-start-3 col-span-6">
                    <div className="flex grid grid-cols-6 items-center">
                        <span className="col-start-1 col-span-5 text-gray-500">
                            *********
                        </span>
                        <span className="col-start-6 col-span-1">{editButton(fieldKey)}</span>
                    </div>
                </span>
            </>
        )
    }

    const noEditEntry = (fieldName, fieldKey) => {
        return (
            <>
                <span className="col-span-2">{fieldName}</span>
                <span className="col-start-3 col-span-6">
                    <div className="flex grid grid-cols-6 items-center">
                        <span className="col-start-1 col-span-5 text-gray-500">
                            {user[fieldKey] ? user[fieldKey] : "NA"}
                        </span>
                    </div>
                </span>
            </>
        )
    }   

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">About me</h2>
            <div className="flex grid grid-cols-8 items-center gap-y-4">
                {entry("Name", "name")}
                {entry("Bio", "bio")}
                {entry("Favourite Destination", "favouriteDestination")}
                {entry("Gender", "gender")}
                {entry("Friends with", "friends")}
            </div>
            <hr className="my-4 border-gray-300" />
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="flex grid grid-cols-8 items-center gap-y-4">
                {entry("Email", "email")}
                {sensitiveEntry("Password", "password")}
                {noEditEntry("Account created on", "createdAt")}
            </div>
        </div>
    );
}

export default detailedInfo;