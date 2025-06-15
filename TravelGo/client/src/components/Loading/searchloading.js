export default function SearchLoading() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-black border-dashed rounded-full animate-spin mb-4"></div>
            <p className="mt-2">Loading...</p>
        </div>
    );
}