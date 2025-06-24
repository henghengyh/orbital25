export default function EventInfoCard({ title, date, amount, type, hideDelete }) {
    const onDelete = () => { };

    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/50">
            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                w-6 h-6
            </div>

            <div className="flex flex-1 items-center justify-between">
                <div>
                    <p className="text-sm text-gray-700 font-medium">Shopping</p>
                    <p className="text-xs text-gray-400 mt-1">25 Jun 2024</p>
                </div>

                <div className="flex items-center gap-2">
                    {!hideDelete && (
                        <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={onDelete}>delete button</button>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 text-green-500">
                        <h6 className="text-xs font-medium">$10.12</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}