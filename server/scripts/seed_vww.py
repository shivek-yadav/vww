import json
import os

db_path = r'C:\dakshayani\Dakshayani_Premium_MERN_MVC\server\src\data\local_db.json'
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

# Categories
db['Category'] = [
    {
        '_id': '671500000000000000000001',
        'name': 'School Uniforms and Sweaters',
        'slug': 'school-uniforms',
        'description': 'Durable, warm V-neck and round-neck school sweaters, blazers, and cardigans.',
        'sortOrder': 0,
        'published': True
    },
    {
        '_id': '671500000000000000000002',
        'name': 'College and Academy Wear',
        'slug': 'college-uniforms',
        'description': 'Trendy varsity jackets, customized hoodies, and youth winter apparel.',
        'sortOrder': 1,
        'published': True
    },
    {
        '_id': '671500000000000000000003',
        'name': 'Corporate and Office Uniforms',
        'slug': 'corporate-uniforms',
        'description': 'Executive blazers, corporate pullovers, formal shirts and polo uniforms.',
        'sortOrder': 2,
        'published': True
    },
    {
        '_id': '671500000000000000000004',
        'name': 'Industrial and Workwear Jackets',
        'slug': 'industrial-uniforms',
        'description': 'Heavy-duty industrial winter jackets, thermal workwear, and safety uniforms.',
        'sortOrder': 3,
        'published': True
    },
    {
        '_id': '671500000000000000000005',
        'name': 'Specialty Sweaters and Cardigans',
        'slug': 'winter-sweaters',
        'description': 'Half-zip sweaters, fancy cardigans, ladies koti, and NCC military pullovers.',
        'sortOrder': 4,
        'published': True
    },
    {
        '_id': '671500000000000000000006',
        'name': 'Tracksuits and Hoodies',
        'slug': 'hoodies-tracksuits',
        'description': 'All-weather sports tracksuits, school athletic sets, and warm fleece hoodies.',
        'sortOrder': 5,
        'published': True
    },
    {
        '_id': '671500000000000000000007',
        'name': 'Uniform Accessories and Ties',
        'slug': 'uniform-accessories',
        'description': 'School ties, woven belts, thermal caps, beanies, and custom badges.',
        'sortOrder': 6,
        'published': True
    }
]

# MenuItems (Products)
db['MenuItem'] = [
    {
        '_id': '671600000000000000000001',
        'name': 'Classic V-Neck School Woollen Sweater',
        'slug': 'classic-v-neck-school-sweater',
        'category': '671500000000000000000001',
        'price': 145,
        'description': 'Standard high-grade acrylic-wool blended school sweater with reinforced V-neck and ribbed cuffs. Soft, anti-pilling, and easy machine wash.',
        'image': '/vww/sweaters/blue-school-sweater.jpg',
        'vegetarian': True,
        'featured': True,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 50
    },
    {
        '_id': '671600000000000000000002',
        'name': 'Dual Stripe Neck School Pullover',
        'slug': 'dual-stripe-neck-school-pullover',
        'category': '671500000000000000000001',
        'price': 165,
        'description': 'Premium full-sleeve knit sweater with contrast neck and cuff stripe design. Ideal for private convent and international school uniforms.',
        'image': '/vww/sweaters/full-sleeve-red-white-stripe-neck-sweater-500x500.webp',
        'vegetarian': True,
        'featured': True,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 50
    },
    {
        '_id': '671600000000000000000003',
        'name': 'Brown Convent School Uniform Sweater',
        'slug': 'brown-convent-school-sweater',
        'category': '671500000000000000000001',
        'price': 155,
        'description': 'Rich chocolate brown uniform sweater with tight gauge knitting for maximum thermal insulation in peak winter.',
        'image': '/vww/sweaters/brown-school-sweater-500x500.webp',
        'vegetarian': True,
        'featured': False,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 50
    },
    {
        '_id': '671600000000000000000004',
        'name': 'Heavy Knit Grey School Pullover',
        'slug': 'heavy-knit-grey-school-pullover',
        'category': '671500000000000000000001',
        'price': 175,
        'description': 'Double-ply winter knit sweater providing maximum warmth. Includes provision for school crest embroidery on left chest.',
        'image': '/vww/sweaters/Gray Knit V-Neck Sweater Profile.png',
        'vegetarian': True,
        'featured': True,
        'popular': False,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 50
    },
    {
        '_id': '671600000000000000000005',
        'name': 'Sainik School Forest Green Woollen Pullover',
        'slug': 'sainik-school-forest-green-pullover',
        'category': '671500000000000000000005',
        'price': 220,
        'description': 'Official military / Sainik School specification heavy ribbed green woollen pullover with shoulder epaulettes and elbow patches.',
        'image': '/vww/ncc/Forest Green School Uniform Sweater-1.png',
        'vegetarian': True,
        'featured': True,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 30
    },
    {
        '_id': '671600000000000000000006',
        'name': 'NCC Cadet Uniform Thermal Sweater',
        'slug': 'ncc-cadet-uniform-thermal-sweater',
        'category': '671500000000000000000005',
        'price': 210,
        'description': 'Standard specification NCC green military knit sweater for school and college cadets with pen slot and velcro name badge provision.',
        'image': '/vww/ncc/Dark Green Sainik School Sweater-2.png',
        'vegetarian': True,
        'featured': False,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 30
    },
    {
        '_id': '671600000000000000000007',
        'name': 'Half-Zip Stand Collar Woollen Sweater',
        'slug': 'half-zip-stand-collar-sweater',
        'category': '671500000000000000000005',
        'price': 195,
        'description': 'Modern brass half-zip ribbed pullover designed for faculty, teachers, and senior college students.',
        'image': '/vww/half_zip_sweaters/WhatsApp Image 2026-11-18 at 3.45.15 PM.jpeg',
        'vegetarian': True,
        'featured': True,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 40
    },
    {
        '_id': '671600000000000000000008',
        'name': 'Ladies Woollen Buttoned Koti / Cardigan',
        'slug': 'ladies-woollen-buttoned-koti',
        'category': '671500000000000000000005',
        'price': 185,
        'description': 'Fine gauge buttoned cardigan designed for girls school uniform and female staff members with convenient dual side pockets.',
        'image': '/vww/ladies_cotti/simg_339 (1).jpg',
        'vegetarian': True,
        'featured': False,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 40
    },
    {
        '_id': '671600000000000000000009',
        'name': 'Heavy Fleece College and Academy Hoodie',
        'slug': 'heavy-fleece-college-hoodie',
        'category': '671500000000000000000002',
        'price': 240,
        'description': '320+ GSM brushed fleece pullover hoodie with kangaroo pocket and drawstrings. Custom screen printing and embroidery available.',
        'image': '/vww/hoodies/hoodie.jpg',
        'vegetarian': True,
        'featured': True,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 50
    },
    {
        '_id': '671600000000000000000010',
        'name': 'All-Weather School Sports Tracksuit Set',
        'slug': 'all-weather-sports-tracksuit-set',
        'category': '671500000000000000000006',
        'price': 320,
        'description': 'Full jacket and lower set crafted from durable NS fabric / poly-cotton with contrast side panel piping and zippered pockets.',
        'image': '/vww/tracksuits/simg_169 (1).jpg',
        'vegetarian': True,
        'featured': True,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 40
    },
    {
        '_id': '671600000000000000000011',
        'name': 'Micro-Poly Athletic Academy Tracksuit',
        'slug': 'micro-poly-athletic-tracksuit',
        'category': '671500000000000000000006',
        'price': 295,
        'description': 'Breathable, moisture-wicking sports tracksuit for sports days, karate clubs, and physical training activities.',
        'image': '/vww/tracksuits/simg_170 (1).jpg',
        'vegetarian': True,
        'featured': False,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 40
    },
    {
        '_id': '671600000000000000000012',
        'name': 'Corporate Polo T-Shirt with Custom Logo',
        'slug': 'corporate-polo-tshirt-custom-logo',
        'category': '671500000000000000000003',
        'price': 140,
        'description': '220 GSM 100% bio-washed cotton pique polo shirt with ribbed collar and high-density chest embroidery for corporate staff.',
        'image': '/vww/tshirts/WhatsApp Image 2026-11-18 at 3.47.04 PM.jpeg',
        'vegetarian': True,
        'featured': True,
        'popular': False,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 60
    },
    {
        '_id': '671600000000000000000013',
        'name': 'School Uniform Custom Striped Ties',
        'slug': 'school-uniform-custom-striped-ties',
        'category': '671500000000000000000007',
        'price': 35,
        'description': 'Jacquard woven polyester ties with woven school emblem or striped color combinations for house uniforms.',
        'image': '/vww/ties/simg_229 (2).jpg',
        'vegetarian': True,
        'featured': False,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 100
    },
    {
        '_id': '671600000000000000000014',
        'name': 'Winter Woollen School Cap / Beanie',
        'slug': 'winter-woollen-school-cap-beanie',
        'category': '671500000000000000000007',
        'price': 45,
        'description': 'Snug-fit thermal knit beanie cap available in multiple school house colours (Navy, Maroon, Camel, Bottle Green).',
        'image': '/vww/caps/cap_camel.webp',
        'vegetarian': True,
        'featured': False,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 100
    },
    {
        '_id': '671600000000000000000015',
        'name': 'Executive Corporate Uniform Blazer',
        'slug': 'executive-corporate-uniform-blazer',
        'category': '671500000000000000000003',
        'price': 650,
        'description': 'Wrinkle-resistant matty wool blend tailored blazer with satin lining and custom metal logo buttons.',
        'image': '/vww/categories/corporate unifroms.png',
        'vegetarian': True,
        'featured': True,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 25
    },
    {
        '_id': '671600000000000000000016',
        'name': 'Heavy Industrial Winter Workwear Jacket',
        'slug': 'heavy-industrial-winter-jacket',
        'category': '671500000000000000000004',
        'price': 480,
        'description': 'Quilted thermal insulated windproof industrial jacket with retro-reflective safety strips and heavy duty YKK zippers.',
        'image': '/vww/categories/industrial_ uniforrms.png',
        'vegetarian': True,
        'featured': True,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 30
    },
    {
        '_id': '671600000000000000000017',
        'name': 'Hospitality and Restaurant Staff Uniform',
        'slug': 'hospitality-restaurant-staff-uniform',
        'category': '671500000000000000000003',
        'price': 390,
        'description': 'Stain-resistant elegant uniform sets including chef coats, server aprons, and hospitality waistcoats.',
        'image': '/vww/categories/hotel and  restaurant unifroms.png',
        'vegetarian': True,
        'featured': False,
        'popular': False,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 30
    },
    {
        '_id': '671600000000000000000018',
        'name': 'Security Personnel Uniform and Woollen Pullover',
        'slug': 'security-personnel-uniform-pullover',
        'category': '671500000000000000000004',
        'price': 340,
        'description': 'Durable tactical navy/black knit sweater with epaulettes, pen pockets, and reinforced shoulder guards.',
        'image': '/vww/categories/security And public  safety unifroms.jpg',
        'vegetarian': True,
        'featured': False,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 30
    },
    {
        '_id': '671600000000000000000019',
        'name': 'Private Label Custom Manufacturing Package',
        'slug': 'private-label-custom-manufacturing',
        'category': '671500000000000000000002',
        'price': 250,
        'description': 'End-to-end custom manufacturing: fabric selection, pattern grading, custom woven labels, branded tags and packaging.',
        'image': '/vww/categories/Private Label Apparel Manufacturing Infographic.png',
        'vegetarian': True,
        'featured': True,
        'popular': True,
        'spicy': False,
        'available': True,
        'published': True,
        'prepMinutes': 100
    }
]

# SiteSettings
db['SiteSettings'] = [
    {
        '_id': '671400000000000000000001',
        'key': 'primary',
        'restaurantName': 'Vijay Woollen Works',
        'tagline': 'Premier Manufacturer of Uniforms & Winter Knitwear',
        'phone': '+91 84272 57106',
        'email': 'vijaywoolenwork@gmail.com',
        'address': 'B-V-1209, Purana Bazaar, Buhrampuri, Ludhiana - 141008, Punjab, India',
        'city': 'Ludhiana',
        'mapUrl': 'https://maps.google.com/?q=Ludhiana+Purana+Bazaar',
        'instagram': 'https://www.instagram.com/vijaywoolenwork',
        'facebook': 'https://www.indiamart.com/vijay-woolen-work-ludhiana/',
        'openingHours': [
            {'day': 'Monday - Saturday', 'open': '09:00 AM', 'close': '08:00 PM', 'closed': False},
            {'day': 'Sunday', 'open': '10:00 AM', 'close': '04:00 PM', 'closed': False}
        ],
        'bookingEnabled': True,
        'orderingEnabled': True,
        'deliveryEnabled': True,
        'deliveryFee': 0,
        'freeDeliveryThreshold': 5000,
        'taxPercentage': 5,
        'currencySymbol': '₹',
        'announcement': '✦ ANNUAL BUMPER WHOLESALE OFFER: Special bulk rates on School Sweaters & Uniforms ✦ Direct Factory Dispatch from Ludhiana ✦ Call: +91 84272 57106 ✦',
        'announcementEnabled': True,
        'promoCode': 'VWWSEASON',
        'promoDiscount': 15,
        'heroTitle': "India's Trusted Manufacturer of School Uniforms & Winter Knitwear",
        'heroSubtitle': 'Specialized in bulk production for schools, colleges, corporate institutions, and private labels since inception in Ludhiana.',
        'heroBadge': 'GST: 03AWNPV3468J1ZX · MSME REGISTERED · FACTORY DIRECT DISPATCH',
        'heroImage': '/vww/branding/Vijay Woollen Works Apparel Solutions.png',
        'reservationMaxGuests': 500,
        'minReservationLeadHours': 24
    }
]

# Testimonials
db['Testimonial'] = [
    {
        '_id': '671700000000000000000001',
        'name': 'Gokul Nand Choudhary',
        'role': 'Assam School Uniform Supplier',
        'comment': 'We ordered 140 school sweaters for standard sizing (24, 26, 28). The railway dispatch was transparent and arrived safely. Excellent rate quotation and honest business ethics.',
        'rating': 5,
        'published': True
    },
    {
        '_id': '671700000000000000000002',
        'name': 'Bhopal SDL Sports Academy',
        'role': 'Sports Goods and Institutional Buyer, MP',
        'comment': 'Received our bulk order of 250 school tracksuits on time. The stitching quality, fabric softness, and customized embroidery exceeded expectations. Highly reliable factory in Ludhiana!',
        'rating': 5,
        'published': True
    },
    {
        '_id': '671700000000000000000003',
        'name': 'Col. R. K. Bakshi (Retd.)',
        'role': 'Sainik and Public School Board, J&K',
        'comment': 'For multiple winter seasons, Vijay Woollen Works has been our trusted winter uniform partner. Their woollen pullovers and caps keep our students warm even in sub-zero Himalayan winters.',
        'rating': 5,
        'published': True
    },
    {
        '_id': '671700000000000000000004',
        'name': 'Apex Engineering Works',
        'role': 'Corporate HR and Safety Head',
        'comment': 'Supplied 180 heavy winter jackets and embroidered hoodies for our plant engineers. Excellent thermal insulation, prompt delivery, and GST invoicing.',
        'rating': 5,
        'published': True
    }
]

# FAQs
db['FAQ'] = [
    {
        '_id': '671800000000000000000001',
        'question': 'What is your Minimum Order Quantity (MOQ) for school and institutional uniforms?',
        'answer': 'Our standard MOQ starts from 30 to 50 pieces per design/color for customized winter wear and 100 pieces for accessories like ties and caps. We also cater to custom sample orders.',
        'sortOrder': 0,
        'published': True
    },
    {
        '_id': '671800000000000000000002',
        'question': 'Do you provide custom logo embroidery and private label printing?',
        'answer': 'Yes! We have state-of-the-art computerized multi-head embroidery machines and screen printing facilities. We also produce custom woven neck labels, care tags, and branded packaging for private labels.',
        'sortOrder': 1,
        'published': True
    },
    {
        '_id': '671800000000000000000003',
        'question': 'How do you dispatch orders across India?',
        'answer': 'Orders are securely packed in moisture-resistant HDPE bags and dispatched via express transport, railway parcel, or reputed road cargo with full tracking and transparent quotation.',
        'sortOrder': 2,
        'published': True
    },
    {
        '_id': '671800000000000000000004',
        'question': 'Can we receive physical fabric samples before confirming bulk production?',
        'answer': 'Absolutely. We dispatch sample slips and fabric swatches anywhere in India upon request so your committee can verify fabric weight, yarn quality, and shade.',
        'sortOrder': 3,
        'published': True
    }
]

# Inquiries (Realistic Client Details from folder)
db['Inquiry'] = [
    {
        '_id': '671900000000000000000001',
        'name': 'Gokul Nand Choudhary',
        'email': 'gokul.choudhary@assamtextiles.in',
        'phone': '+91 94350 12890',
        'subject': 'Order Quotation - School Uniform Sweaters (140 pcs)',
        'message': 'Requirement for sizes 24 (30 pcs), 26 (70 pcs), 28 (40 pcs) standard quality school sweaters. Please send final dispatch slip and railway parcel charges.',
        'status': 'in_progress',
        'adminNote': 'Quotation generated: Rs 21,420 (incl 5% GST). 50% advance received. Ready for dispatch.'
    },
    {
        '_id': '671900000000000000000002',
        'name': 'Rajesh Malviya',
        'email': 'bhopal.sdlsports@gmail.com',
        'phone': '+91 75524 89123',
        'subject': 'Bulk Tracksuits and Polo Uniforms (250 pcs)',
        'message': 'Need micro-poly athletic school tracksuits with white side stripe and custom logo embroidery on chest. Urgently required for annual sports meet.',
        'status': 'new',
        'adminNote': 'Sample dispatch slip prepared. Party requested rate of Rs 290 per set.'
    },
    {
        '_id': '671900000000000000000003',
        'name': 'Bashir Ahmad Wani',
        'email': 'jkconvent.office@gmail.com',
        'phone': '+91 99065 44321',
        'subject': 'Winter Sweaters and Beanie Caps for 300 Students',
        'message': 'Srinagar district convent school requirement for double-ply winter knit sweaters and warm beanies with custom school logo patch.',
        'status': 'in_progress',
        'adminNote': 'Fabric swatches and sample pullover dispatched via speed cargo.'
    },
    {
        '_id': '671900000000000000000004',
        'name': 'Vikram Mehra',
        'email': 'vmehra@apexengineering.com',
        'phone': '+91 98140 55678',
        'subject': 'Heavy Winter Industrial Work Jackets (180 pcs)',
        'message': 'Need thermal windproof work jackets with reflective safety stripes and company name embroidery for factory workforce.',
        'status': 'resolved',
        'adminNote': 'Completed and dispatched. Full GST bill provided.'
    }
]

# Gallery Images
db['GalleryImage'] = [
    {
        '_id': '671a00000000000000000001',
        'title': 'School Uniforms Collection',
        'category': 'School Wear',
        'image': '/vww/categories/Vijay Woollen Works School Uniforms_items.png',
        'published': True
    },
    {
        '_id': '671a00000000000000000002',
        'title': 'Corporate Uniform Solutions',
        'category': 'Corporate Wear',
        'image': '/vww/categories/Vijay Woollen Works Corporate Uniforms.png',
        'published': True
    },
    {
        '_id': '671a00000000000000000003',
        'title': 'College and Varsity Apparel',
        'category': 'College Wear',
        'image': '/vww/categories/College Uniforms Apparel Collection.png',
        'published': True
    },
    {
        '_id': '671a00000000000000000004',
        'title': 'Industrial Safety and Workwear',
        'category': 'Industrial',
        'image': '/vww/categories/Vijay Woollen Works Industrial Uniforms.png',
        'published': True
    },
    {
        '_id': '671a00000000000000000005',
        'title': 'Private Label Manufacturing Infographic',
        'category': 'Manufacturing',
        'image': '/vww/categories/Private Label Apparel Manufacturing Infographic.png',
        'published': True
    },
    {
        '_id': '671a00000000000000000006',
        'title': 'Sportswear and Tracksuits Guide',
        'category': 'Sportswear',
        'image': '/vww/categories/Vijay Woollen Works Sportswear Guide.png',
        'published': True
    }
]

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print('SUCCESS: Updated local_db.json! Products:', len(db['MenuItem']), 'Categories:', len(db['Category']), 'Inquiries:', len(db['Inquiry']))
