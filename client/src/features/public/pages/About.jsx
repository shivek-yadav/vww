import { Factory, ShieldCheck, Award, Truck, CheckCircle2, Phone, MessageCircle, Download } from 'lucide-react';
import { useFetch, SectionTitle, PageHero } from '../../../components/UI';
import { Link } from 'react-router-dom';

export function About() {
    const { data: pageData } = useFetch('/pages/about');

    const dynamicAbout = {
        eyebrow: pageData?.subtitle || "MANUFACTURING EXCELLENCE SINCE INCEPTION",
        title: pageData?.title || "About Vijay Woollen Works",
        description: pageData?.description || "Ludhiana’s specialized manufacturer and supplier of School Uniforms, Winter Knitwear, Corporate Attire & Workwear.",
        image: pageData?.heroImage || "/vww/branding/Vijay Woollen Works Apparel Solutions.png",
        storyHeading: "Crafting Durability & Comfort from Ludhiana’s Textile Heartland",
        storyParagraph1: "Located at Purana Bazaar, Buhrampuri, Ludhiana, Vijay Woollen Works (VWW) is a dedicated manufacturer and supplier of premier winter wear and institutional uniforms. Ludhiana is globally celebrated as India's knitwear capital, providing us direct access to high-grade acrylic, wool-blend yarns, and modern textile machinery.",
        storyParagraph2: "From standard V-neck school uniform pullovers and double-ply winter knitwear to heavy-duty industrial safety jackets and college hoodies, every garment undergoes rigorous quality testing for anti-pilling, color-fastness, and stitching strength.",
        gst: "03AWNPV3468J1ZX",
        msme: "Govt. Registered Enterprise",
        factoryImage: "/vww/categories/Private Label Apparel Manufacturing Infographic.png"
    };

    if (pageData?.body) {
        try {
            const parsed = typeof pageData.body === 'string' ? JSON.parse(pageData.body) : pageData.body;
            if (parsed.eyebrow) dynamicAbout.eyebrow = parsed.eyebrow;
            if (parsed.storyHeading) dynamicAbout.storyHeading = parsed.storyHeading;
            if (parsed.storyParagraph1) dynamicAbout.storyParagraph1 = parsed.storyParagraph1;
            if (parsed.storyParagraph2) dynamicAbout.storyParagraph2 = parsed.storyParagraph2;
            if (parsed.gst) dynamicAbout.gst = parsed.gst;
            if (parsed.msme) dynamicAbout.msme = parsed.msme;
            if (parsed.factoryImage) dynamicAbout.factoryImage = parsed.factoryImage;
        } catch {
            // fallback
        }
    }

    return (
        <>
            <PageHero 
                eyebrow={dynamicAbout.eyebrow} 
                title={dynamicAbout.title} 
                description={dynamicAbout.description} 
                image={dynamicAbout.image}
            />

            {/* Core Story Section */}
            <section className="section" style={{ padding: '60px 0', background: '#ffffff' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: '#1e3a8a', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                            Our Heritage & Infrastructure
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '18px', lineHeight: '1.25' }}>
                            {dynamicAbout.storyHeading}
                        </h2>
                        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#475569', marginBottom: '16px' }}>
                            {dynamicAbout.storyParagraph1}
                        </p>
                        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#475569', marginBottom: '24px' }}>
                            {dynamicAbout.storyParagraph2}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                                <strong style={{ display: 'block', fontSize: '18px', color: '#1e3a8a', fontWeight: '800' }}>GST Compliant</strong>
                                <small style={{ color: '#64748b', fontSize: '12px' }}>{dynamicAbout.gst}</small>
                            </div>
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                                <strong style={{ display: 'block', fontSize: '18px', color: '#1e3a8a', fontWeight: '800' }}>Udyam MSME</strong>
                                <small style={{ color: '#64748b', fontSize: '12px' }}>{dynamicAbout.msme}</small>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Link to="/menu" style={{ background: '#1e3a8a', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                                Explore Product Catalog
                            </Link>
                            <a 
                                href="/vww/documents/Print _ Udyam Registration Certificate - converted.pdf" 
                                target="_blank"
                                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '12px 20px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Download size={15} /> Udyam Certificate
                            </a>
                        </div>
                    </div>

                    <div>
                        <img 
                            src={dynamicAbout.factoryImage} 
                            alt="Manufacturing Process"
                            style={{ width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}
                        />
                    </div>
                </div>
            </section>

            {/* Private Label & Custom Manufacturing Capabilities */}
            <section className="section" style={{ background: '#f8fafc', padding: '60px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
                        <span style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Customization & Branding
                        </span>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                            Private Label & Customized Apparel
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '15px' }}>
                            We assist schools, distributors, and corporate brands in launching their proprietary uniform labels.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
                        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#eff6ff', color: '#1e3a8a', width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                <Award size={22} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                Computerized Logo Embroidery
                            </h3>
                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                                High-thread density multi-color school crests, institution monograms, and corporate chest badges.
                            </p>
                        </div>

                        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#eff6ff', color: '#1e3a8a', width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                <ShieldCheck size={22} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                Woven Neck & Size Labels
                            </h3>
                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                                Custom woven damask labels, heat-transfer tags, care instruction labels, and custom branded hang tags.
                            </p>
                        </div>

                        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#eff6ff', color: '#1e3a8a', width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                <Truck size={22} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                Transparent Dispatch
                            </h3>
                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                                Transparent railway parcel and road transport booking with LR number tracking and approved freight estimates.
                            </p>
                        </div>

                        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#eff6ff', color: '#1e3a8a', width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                <Factory size={22} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                Direct Factory Rates
                            </h3>
                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                                Genuine factory pricing with zero middleman commissions, passing real savings directly to educational and corporate institutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Band */}
            <section style={{ background: '#0f172a', color: '#ffffff', padding: '50px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
                            Ready to Procure for Your School or Institution?
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '15px' }}>
                            Call our factory proprietor Vijay Pratap directly or send sample dispatch requirements.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <a href="tel:+918427257106" style={{ background: '#2563eb', color: '#ffffff', padding: '12px 22px', borderRadius: '6px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone size={16} /> +91 84272 57106
                        </a>
                        <Link to="/booking" style={{ background: '#ffffff', color: '#0f172a', padding: '12px 22px', borderRadius: '6px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                            Request Quotation
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
