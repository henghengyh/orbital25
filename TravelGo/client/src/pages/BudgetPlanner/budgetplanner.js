import Navbar from "../../components/Navbar/navbar";

export default function BudgetPlanner() {
    return (
        <div>
            <Navbar /> {/* Navbar component for navigation */}
            <h1>Budget Planner</h1>
            <p>Plan your travel budget here.</p>
            <form>
                <label htmlFor="destination">Destination:</label>
                <input type="text" id="destination" name="destination" required />
                
                <label htmlFor="budget">Budget:</label>
                <input type="number" id="budget" name="budget" required />
                
                <button type="submit">Calculate</button>
            </form>
        </div>
    );
}