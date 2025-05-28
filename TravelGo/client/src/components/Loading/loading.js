export default function Loading() {
    return (
        <div>
            <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center z-50 bg-gray-400 bg-opacity-70">
                <div className="w-12 h-12 border-4 border-black border-dashed rounded-full animate-spin mb-4"></div>
                <p className="mt-2">Loading...</p>
            </div>
        </div>
    );
}