import { PencilIcon } from '@heroicons/react/24/solid';

function detailedInfo({ user, onEditEmail, onEditPW, onEditSignUp, onEditProfile }) {
    const editButton = (f) => {
        return <button
            className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none"
            onClick={f}
            aria-label="Edit"
        ><PencilIcon className="w-3 h-3" /></button>
    }

    const entry = (fieldName, profileInfo = false, fieldKey) => {
        return (
            <>
                <span className="col-span-2">{fieldName}</span>
                <span className="col-start-3 col-span-6">
                    <div className="grid grid-cols-6 items-center">
                        <span className="col-start-1 col-span-5">
                            {user.profileInfo[fieldKey] ? (user.profileInfo[fieldKey]) : (user[fieldKey] ? user[fieldKey] : "-")}
                        </span>
                    </div>
                </span>
            </>
        )
    }

    const emailEntry = (fieldName, fieldKey) => {
        return (
            <>
                <span className="col-span-2">{fieldName}</span>
                <span className="col-start-3 col-span-6">
                    <div className="grid grid-cols-6 items-center">
                        <span className="col-start-1 col-span-5 text-gray-500">
                            {user[fieldKey].toString().slice(0, 3) + "*".repeat(user[fieldKey].length - 6) + user[fieldKey].toString().slice(-3)}
                        </span>
                        <span className="col-start-6 col-span-1">{editButton(onEditEmail)}</span>
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
                    <div className="grid grid-cols-6 items-center">
                        <span className="col-start-1 col-span-5 text-gray-500">
                            *********
                        </span>
                        <span className="col-start-6 col-span-1">{editButton(onEditPW)}</span>
                    </div>
                </span>
            </>
        )
    }

    const DOBentry = (fieldName, profileInfo = true, fieldKey) => {
        return (
            <>
                <span className="col-span-2">{fieldName}</span>
                <span className="col-start-3 col-span-6">
                    <div className="grid grid-cols-6 items-center">
                        <span className="col-start-1 col-span-5">
                            {user.profileInfo[fieldKey] ? (user.profileInfo[fieldKey].slice(0, 10)) : (user[fieldKey] ? user[fieldKey].slice(0, 10) : "-")}
                        </span>
                    </div>
                </span>
            </>
        )
    }

    const signUpEntry = (fieldName, fieldKey) => {
        return (
            <>
                <span className="col-span-2">{fieldName}</span>
                <span className="col-start-3 col-span-6">
                    <div className="grid grid-cols-6 items-center">
                        <span className="col-start-1 col-span-5 text-gray-500">
                            {user.emailSignUp ? "Yes" : "No"}
                        </span>
                        <span className="col-start-6 col-span-1">{editButton(onEditSignUp)}</span>
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
                    <div className="grid grid-cols-6 items-center">
                        <span className="col-start-1 col-span-5 text-gray-500">
                            {user[fieldKey] ? user[fieldKey].slice(0, 10) : "NA"}
                        </span>
                    </div>
                </span>
            </>
        )
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                <div className="grid grid-cols-8">
                    <span className="col-span-2">About me</span>
                    <span className="flex items-center">
                        <button
                            className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow focus:outline-none"
                            onClick={onEditProfile}
                            aria-label="Edit Profile"
                        >
                            <PencilIcon className="w-3 h-3" />
                        </button>
                    </span>
                </div>
            </h2>

            <div className="grid grid-cols-8 items-center gap-y-4">
                {entry("Name", false, "name")}
                {entry("Bio", true, "bio")}
                {entry("Favourite Destination", true, "favouriteDestination")}
                {entry("Gender", true, "gender")}
                {DOBentry("Date of Birth", true, "dateOfBirth")}
                {entry("Friends with", true, "friends")}
            </div>
            <hr className="my-4 border-gray-300" />
            <h2 className="text-xl font-bold mb-4">Security Information</h2>
            <div className="grid grid-cols-8 items-center gap-y-4">
                {emailEntry("Email", "email")}
                {sensitiveEntry("Password", "password")}
                {signUpEntry("Receive Email Notifications", "emailSignUp")}
                {noEditEntry("Account created on", "accountCreatedOn")}
            </div>
        </div>
    );
}

export default detailedInfo;