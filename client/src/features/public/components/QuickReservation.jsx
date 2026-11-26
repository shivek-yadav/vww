import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowUpRight, Package, Building2 } from 'lucide-react';

/** Collects category and quantity; navigates to /booking for full quote. */
export function QuickReservation() {
    const navigate = useNavigate();
    const [category, setCategory] = useState('School Uniform Sweaters');
    const [quantity, setQuantity] = useState('100');

    function submit(e) {
        e.preventDefault();
        navigate(`/booking?${new URLSearchParams({ category, quantity })}`);
    }

    return (
        <form className="quick-reservation" onSubmit={submit} aria-label="Quick quotation request">
            <div className="quick-reservation-heading">
                <span className="quick-icon"><FileText size={20}/></span>
                <div>
                    <small>INSTITUTIONAL DIRECT</small>
                    <strong>Request Fast Mill Quote</strong>
                </div>
            </div>
            <label>
                <span><Package size={15}/> Uniform Category</span>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="School Uniform Sweaters">School Uniform Sweaters</option>
                    <option value="College & Academy Hoodies">College & Academy Hoodies</option>
                    <option value="Corporate & Office Uniforms">Corporate & Office Uniforms</option>
                    <option value="Industrial Workwear">Industrial Workwear</option>
                </select>
            </label>
            <label>
                <span><Building2 size={15}/> Estimated Quantity (Pieces)</span>
                <input 
                    type="number" 
                    min="25" 
                    required 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)}
                    placeholder="Min 50 pcs"
                />
            </label>
            <button className="quick-reservation-submit" type="submit">
                Get Mill Quote & Specs <ArrowUpRight size={18}/>
            </button>
            <p>Direct factory dispatch with GST billing from Ludhiana, Punjab.</p>
        </form>
    );
}
