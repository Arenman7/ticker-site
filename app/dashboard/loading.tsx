export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-neutral-900">
            <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce delay-0"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-50"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-150"></div>
            </div>
        </div>
    );
}