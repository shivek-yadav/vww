import { Status } from '../../../components/UI';
import { text, boolean, AdminCrud } from '../components/AdminShared';

export function AdminFaqs() {
    return (
        <AdminCrud
            title="Wholesale FAQs"
            subtitle="Manage answers for institutional buyers regarding bulk MOQ, fabric blends, computerized flat knitting, and Pan-India dispatch."
            endpoint="faqs"
            headingLabel="FAQ"
            fields={[
                text('question', 'Wholesale Question', true),
                { key: 'answer', label: 'Detailed Answer', type: 'textarea', required: true },
                { key: 'sortOrder', label: 'Display Order Priority', type: 'number' },
                boolean('published', 'Published on Website')
            ]}
            defaults={{ published: true, sortOrder: 0 }}
            columns={[
                { label: 'Question', render: x => <strong>{x.question}</strong> },
                { label: 'Answer', render: x => <span className="table-truncate">{x.answer}</span> },
                { label: 'Status', render: x => <Status value={x.published ? 'published' : 'hidden'} /> }
            ]}
        />
    );
}
