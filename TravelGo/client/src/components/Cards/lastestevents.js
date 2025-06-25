import EventInfoCard from "./eventinfocard";

export default function LatestEvents() {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Recent Expenditure</h5>
            </div>

            <div className="mt-6">
                <EventInfoCard />
                <EventInfoCard />
                <EventInfoCard />
                <EventInfoCard />
            </div>
        </div>
    )
}