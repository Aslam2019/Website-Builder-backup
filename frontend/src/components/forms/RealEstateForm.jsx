import {
  Field, ImageUpload, DynamicList, FormSection,
} from './FormField'

/* ============ Dropdown options ============ */
const PROPERTY_TYPES = [
  'Villa', 'Apartment', 'Independent House', 'Plot',
  'Commercial', 'Office Space', 'Shop', 'Warehouse',
  'Agricultural Land', 'Penthouse', 'Studio', 'Other',
]

const AVAILABILITY_STATUS = [
  'Ready to Move', 'Under Construction', 'New Launch', 'Resale', 'Sold Out',
]

const WHY_ICONS = [
  'Shield Check', 'Users', 'Star', 'Tag',
  'Clock', 'Headset', 'Home', 'Building',
  'Award', 'Thumbs Up', 'Map', 'Trending Up',
]

export default function RealEstateForm({ data, onChange }) {
  const set = (name, value) => onChange({ ...data, [name]: value })

  return (
    <div className="cat-form">

      {/* ==========================================
          ① HOME (Hero Section)
          ========================================== */}
      <FormSection
        step={1}
        title="Home"
        description="Hero section — the first thing visitors see on your website.">
        <div className="ff-grid">
          <Field
            label="Company Name"
            name="company_name"
            value={data.company_name}
            onChange={set}
            required
            placeholder="e.g. Skyline Realty"
          />
          <Field
            label="Tagline / Headline"
            name="tagline"
            value={data.tagline}
            onChange={set}
            placeholder="e.g. Find Your Dream Home In Just One Visit"
            help="Main heading on hero. Leave blank to use default."
          />
        </div>

        <Field
          label="Hero Description"
          name="about"
          value={data.about}
          onChange={set}
          type="textarea"
          required
          rows={4}
          maxLength={1200}
          placeholder="Short intro about your company shown on the hero section..."
        />

        <ImageUpload
          label="Company Logo"
          name="logo"
          value={data.logo}
          onChange={set}
          folder="logo"
        />

        <div className="ff-grid">
          <Field
            label="Years of Experience"
            name="years_experience"
            value={data.years_experience}
            onChange={set}
            placeholder="e.g. 10"
            help="Shown as '10+ Years Experience' in hero stats"
          />
          <Field
            label="Happy Clients"
            name="happy_clients"
            value={data.happy_clients}
            onChange={set}
            placeholder="e.g. 500"
            help="Shown as '500+ Happy Clients' in hero stats"
          />
        </div>
      </FormSection>

      {/* ==========================================
          ② ABOUT
          ========================================== */}
      <FormSection
        step={2}
        title="About"
        description="Detailed info about your company shown in the About section.">
        <Field
          label="About Company (Full Description)"
          name="about_full"
          value={data.about_full}
          onChange={set}
          type="textarea"
          rows={5}
          maxLength={1500}
          placeholder="Detailed description about your company, mission, vision, and what makes you different. Leave blank to use the hero description."
        />
      </FormSection>

      {/* ==========================================
          ③ WHY CHOOSE US
          ========================================== */}
      <FormSection
        step={3}
        title="Why Choose Us"
        description="Feature cards shown in the Why Choose Us section — build trust with buyers.">
        <DynamicList
          label="Feature Cards"
          name="features"
          value={data.features || []}
          onChange={set}
          addLabel="Feature"
          itemFields={[
            {
              name: 'icon',
              label: 'Icon',
              type: 'select',
              placeholder: 'Select icon',
              options: WHY_ICONS,
            },
            {
              name: 'title',
              label: 'Feature Title',
              type: 'text',
              placeholder: 'e.g. Trusted & Verified',
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'Short description of this feature...',
            },
          ]}
        />

        <p className="muted" style={{ fontSize: 12.5, margin: '4px 0 0 4px' }}>
          💡 Leave blank to use 6 default features (Trusted, Expert Team, Premium Listings, etc.)
        </p>
      </FormSection>

      {/* ==========================================
          ④ PROPERTY
          ========================================== */}
      <FormSection
        step={4}
        title="Property"
        description="Your property listings. Add as many as you want — each becomes a card.">
        <DynamicList
          label="Properties"
          name="properties"
          value={data.properties || []}
          onChange={set}
          addLabel="Property"
          itemFields={[
            { name: 'name', label: 'Property Name', type: 'text', placeholder: 'e.g. Modern Luxury Villa' },
            { name: 'type', label: 'Property Type', type: 'select', placeholder: 'Select type', options: PROPERTY_TYPES },
            { name: 'price', label: 'Price', type: 'text', placeholder: 'e.g. ₹1.2 Cr' },
            { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Anna Nagar, Chennai' },
            { name: 'beds', label: 'Bedrooms', type: 'text', placeholder: 'e.g. 4 Beds' },
            { name: 'area', label: 'Area / Size', type: 'text', placeholder: 'e.g. 2500 sqft' },
            { name: 'status', label: 'Availability', type: 'select', placeholder: 'Select status', options: AVAILABILITY_STATUS },
            { name: 'image', label: 'Property Image', type: 'image' },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Key features and amenities...' },
          ]}
        />
      </FormSection>

      {/* ==========================================
          ⑤ CONTACT
          ========================================== */}
      <FormSection
        step={5}
        title="Contact"
        description="Contact information shown in Contact section and footer.">
        <div className="ff-grid">
          <Field
            label="Contact Number"
            name="phone"
            value={data.phone}
            onChange={set}
            type="tel"
            required
            placeholder="9876543210"
          />
          <Field
            label="WhatsApp Number"
            name="whatsapp"
            value={data.whatsapp}
            onChange={set}
            type="tel"
            placeholder="9876543210"
            help="Buyers can chat with you directly on WhatsApp"
          />
          <Field
            label="Email Address"
            name="email"
            value={data.email}
            onChange={set}
            type="email"
            required
            placeholder="hello@yourcompany.com"
          />
        </div>

        <Field
          label="Office Address"
          name="address"
          value={data.address}
          onChange={set}
          type="textarea"
          rows={2}
          placeholder="Street, Area, City, State, PIN Code"
        />

        <div className="ff-grid">
          <Field
            label="Facebook Page URL"
            name="social_facebook"
            value={data.social_facebook}
            onChange={set}
            type="url"
            placeholder="https://facebook.com/yourpage"
          />
          <Field
            label="Instagram Profile URL"
            name="social_instagram"
            value={data.social_instagram}
            onChange={set}
            type="url"
            placeholder="https://instagram.com/yourprofile"
          />
        </div>
      </FormSection>
    </div>
  )
}