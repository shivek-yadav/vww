import { Status } from '../../../components/UI';
import { text, boolean, AdminCrud } from '../components/AdminShared';

export function AdminCategories() {
    return (
        <AdminCrud
            title="Uniform Categories"
            subtitle="Organise your knitwear and apparel catalog into school, college, corporate and industrial uniform lines."
            endpoint="categories"
            headingLabel="Category"
            fields={[
                text('name', 'Category Name', true),
                text('slug', 'URL Slug (optional)'),
                text('description', 'Category Description'),
                { key: 'image', label: 'Category Banner Image', type: 'image' },
                { key: 'sortOrder', label: 'Display Order Priority', type: 'number' },
                boolean('published', 'Visible on Website Catalog')
            ]}
            defaults={{ published: true, sortOrder: 0 }}
            columns={[
                { label: 'Category Name', render: x => <strong>{x.name}</strong> },
                { key: 'slug', label: 'URL Slug' },
                { label: 'Display Order', render: x => x.sortOrder },
                { label: 'Status', render: x => <Status value={x.published ? 'published' : 'hidden'} /> }
            ]}
        />
    );
}
