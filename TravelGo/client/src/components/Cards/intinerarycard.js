export default function ItineraryCard() {
    return (
        <div className="border rounded-lg overflow-hidden bg-lavender-gray hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
            <div className="p-4 flex items-center gap-3">
                <div className="flex-1">
                    <h6 className="text-sm font-medium">Singapore</h6>
                    <span className="text-xs text-slate-500">
                        {/* {date ? moment(date).format("DD MM YYYY") : "-"} */}
                        10 June 2025 - 11 June 2025
                    </span>
                    <p className="text-xs text-slate-600 mt-2">Number of people: 2</p>
                </div>
            </div>
        </div>
    )
}