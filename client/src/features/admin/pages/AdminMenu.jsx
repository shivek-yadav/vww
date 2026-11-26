import { money, photoFallback } from '../../../api';
import { Status, useFetch } from '../../../components/UI';
import { text, boolean, AdminCrud } from '../components/AdminShared';

export function AdminMenu() { 
    const { data: categories } = useFetch('/admin/categories'); 
    const fields = [
        text('name', 'Product name', true), 
        text('slug', 'URL slug (optional)'), 
        { key: 'description', label: 'Fabric & Product Description', type: 'textarea', required: true }, 
        { key: 'price', label: 'Wholesale Price per Piece (₹)', type: 'number', required: true }, 
        { key: 'category', label: 'Category', type: 'select', required: true, options: (categories || []).map(c => ({ value: c._id, label: c.name })) }, 
        { key: 'image', label: 'Product image (URL or path)', type: 'image' }, 
        boolean('available', 'Available in stock / Production ready'), 
        boolean('published', 'Published on website catalog'), 
        boolean('featured', 'Featured on homepage showcase'), 
        boolean('popular', 'Bestseller / High demand'), 
        { key: 'prepMinutes', label: 'Minimum Order Quantity (MOQ pcs)', type: 'number' }
    ]; 

    return (
        <AdminCrud 
            title="Product Catalog & Wholesale Inventory" 
            subtitle="Create, edit and manage your school uniform, knitwear, and winter apparel products." 
            endpoint="menu" 
            headingLabel="Product" 
            fields={fields} 
            defaults={{ available: true, published: true, featured: false, popular: false, prepMinutes: 50 }} 
            columns={[
                { 
                    label: 'Product', 
                    render: x => (
                        <div className="table-product">
                            <img src={x.image || photoFallback} alt="" onError={(e) => { e.target.src = '/vww/branding/Vijay Woollen Works Apparel Solutions.png'; }} />
                            <div>
                                <strong>{x.name}</strong>
                                <small>MOQ: {x.prepMinutes || 50} pcs</small>
                            </div>
                        </div>
                    ) 
                }, 
                { label: 'Wholesale Rate', render: x => `${money(x.price)} / pc` }, 
                { label: 'Production Status', render: x => <Status value={x.available ? 'available' : 'unavailable'}/> }, 
                { label: 'Published', render: x => <Status value={x.published ? 'published' : 'hidden'}/> }
            ]}
        />
    ); 
}
