import noExpensesImg from "../../assets/noExpenses.svg";

export default function EmptyExpenses() {
    return (
        <div className="flex flex-col items-center justify-center mt-16 mb-12">
            <img src={noExpensesImg} alt="No Expenses" className="w-24" />
            <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
                Click the 'Add Expenses' button to start adding your expenditure.
            </p>
        </div>
    )
}