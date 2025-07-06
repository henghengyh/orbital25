import { styleAmount } from '../../utils/helper';

export default function SplitExpensesInfoCard({ from, to, amount }) {
    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 max-w-full rounded-lg hover:bg-gray-100/50">
            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                <ion-icon name="person" style={{ height: "24px", width: "24px" }}></ion-icon>
            </div>

            <div className="flex flex-1 items-center justify-between max-w-[86%]">
                <div className='text-sm text-gray-700 font-medium capitalize max-w-[70%]'>
                    <p className="truncate whitespace-nowrap line-clamp-1">To: {to}</p>
                    <p className="mt-1 truncate line-clamp-1 whitespace-nowrap">From: {from}</p>
                </div>

                <div className="flex items-center flex-shrink-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 text-blue-500">
                        <h6 className="text-md font-semibold">${styleAmount(Math.abs(amount))}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}
