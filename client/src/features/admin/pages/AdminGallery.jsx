import { Status } from '../../../components/UI';
import { text, boolean, AdminCrud } from '../components/AdminShared';

export function AdminGallery() {
    return (
        <AdminCrud
            title="Factory Showcase Gallery"
            subtitle="Manage production floor photos, knitwear swatches, and uniform showcases displayed on the website."
            endpoint="gallery"
            headingLabel="Showcase Photo"
            fields={[
                text('title', 'Image Title / Uniform Line', true),
                text('category', 'Category (e.g. School Sweaters, Corporate Wear, Factory Loom)', true),
                { key: 'url', label: 'Image URL or Upload (https:// or /vww/...)', type: 'image', required: true },
                { key: 'sortOrder', label: 'Display Order Priority (Lower numbers show first)', type: 'number' },
                boolean('published', 'Published on Website Showcase')
            ]}
            defaults={{ category: 'School Sweaters', published: true, sortOrder: 0 }}
            prepare={(form) => {
                const img = form.url || form.image || '';
                return {
                    ...form,
                    url: img,
                    image: img
                };
            }}
            columns={[
                {
                    label: 'Showcase Image',
                    render: x => (
                        <div className="table-product">
                            <img 
                                src={x.url || x.image} 
                                alt="" 
                                onError={(e) => { e.target.src = '/vww/branding/Vijay Woollen Works Apparel Solutions.png'; }} 
                            />
                            <div>
                                <strong>{x.title || 'Untitled Showcase'}</strong>
                                <small style={{ display: 'block', color: '#64748b' }}>Order: {x.sortOrder ?? 0}</small>
                            </div>
                        </div>
                    )
                },
                { key: 'category', label: 'Category' },
                { label: 'Status', render: x => <Status value={x.published ? 'published' : 'hidden'} /> }
            ]}
        />
    );
}
