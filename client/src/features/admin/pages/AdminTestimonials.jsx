import { Status } from '../../../components/UI';
import { text, boolean, AdminCrud } from '../components/AdminShared';

export function AdminTestimonials() {
    return (
        <AdminCrud
            title="Institutional Testimonials & Reviews"
            subtitle="Moderate and showcase feedback from school principals, academy coordinators, and corporate clients."
            endpoint="testimonials"
            headingLabel="Client Review"
            fields={[
                text('name', 'Institution / Client Name', true),
                text('role', 'Designation / School (e.g. Principal, DAV Public School)'),
                { key: 'quote', label: 'Client Feedback / Testimonial', type: 'textarea', required: true },
                { key: 'rating', label: 'Rating (1–5 Stars)', type: 'number' },
                boolean('published', 'Approved and Published')
            ]}
            defaults={{ rating: 5, published: true }}
            columns={[
                {
                    label: 'Client / Institution',
                    render: x => (
                        <div>
                            <strong>{x.name}</strong>
                            {x.role && <small className="table-sub">{x.role}</small>}
                        </div>
                    )
                },
                { label: 'Review', render: x => <span className="table-truncate">{x.quote}</span> },
                { label: 'Rating', render: x => `★ ${x.rating || 5}` },
                { label: 'Status', render: x => <Status value={x.published ? 'published' : 'pending'} /> }
            ]}
        />
    );
}
