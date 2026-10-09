import {
  Field, ImageUpload, ImageListUpload, DynamicList, FormSection,
} from './FormField'

const SERVICE_CATEGORIES = [
  'Wedding', 'Portrait', 'Event', 'Product', 'Fashion',
  'Maternity', 'Newborn', 'Commercial', 'Travel', 'Other',
]

const PACKAGE_TYPES = [
  'Hourly', 'Half Day', 'Full Day', 'Multi Day', 'Custom',
]

export default function PhotographyForm({ data, onChange }) {
  const set = (name, value) => onChange({ ...data, [name]: value })

  return (
    <div className="cat-form">

      {/* ① HOME */}
      <FormSection
        step={1}
        title="Home"
        description="Hero section — first impression of your photography business.">
        <div className="ff-grid">
          <Field
            label="Studio Name"
            name="studio_name"
            value={data.studio_name}
            onChange={set}
            required
            placeholder="e.g. Lens & Light Studio"
          />
          <Field
            label="Tagline / Headline"
            name="tagline"
            value={data.tagline}
            onChange={set}
            placeholder="e.g. Capturing Moments That Last Forever"
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
          maxLength={800}
          placeholder="Short intro about your photography style and approach..."
        />

        <ImageUpload
          label="Studio Logo"
          name="logo"
          value={data.logo}
          onChange={set}
          folder="logo"
        />

        <div className="ff-grid">
          <Field
            label="Happy Clients"
            name="happy_clients"
            value={data.happy_clients}
            onChange={set}
            placeholder="e.g. 500"
            help="Shown as '500+ Happy Clients' on hero"
          />
          <Field
            label="Years of Experience"
            name="years_experience"
            value={data.years_experience}
            onChange={set}
            placeholder="e.g. 8"
            help="Shown as '8+ Years Experience' on hero"
          />
        </div>
      </FormSection>

      {/* ② ABOUT */}
      <FormSection
        step={2}
        title="About"
        description="Tell clients about yourself and your photography journey.">
        <Field
          label="About Photographer (Full Description)"
          name="about_full"
          value={data.about_full}
          onChange={set}
          type="textarea"
          rows={5}
          maxLength={1500}
          placeholder="Detailed description about your journey, specialities, style, and what makes you unique..."
        />

        <div className="ff-grid">
          <Field
            label="Photographer Name"
            name="photographer_name"
            value={data.photographer_name}
            onChange={set}
            placeholder="e.g. Rahul Verma"
          />
          <Field
            label="Speciality"
            name="speciality"
            value={data.speciality}
            onChange={set}
            placeholder="e.g. Wedding & Portrait Photography"
          />
        </div>

        <ImageUpload
          label="Photographer Profile Photo"
          name="profile_image"
          value={data.profile_image}
          onChange={set}
          folder="profile"
        />

        <div className="ff-grid">
          <Field
            label="Working Hours"
            name="working_hours"
            value={data.working_hours}
            onChange={set}
            placeholder="e.g. Mon–Sat, 10 AM – 7 PM"
          />
          <Field
            label="Booking Info"
            name="appointment_info"
            value={data.appointment_info}
            onChange={set}
            placeholder="e.g. Booking required. Advance payment."
          />
        </div>
      </FormSection>

      {/* ③ PORTFOLIO */}
      <FormSection
        step={3}
        title="Portfolio"
        description="Showcase your best work. Upload images with title and category.">
        <DynamicList
          label="Portfolio Items"
          name="portfolio"
          value={data.portfolio || []}
          onChange={set}
          addLabel="Portfolio Item"
          itemFields={[
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              placeholder: 'e.g. Priya & Arjun Wedding',
            },
            {
              name: 'category',
              label: 'Category',
              type: 'select',
              placeholder: 'Select category',
              options: SERVICE_CATEGORIES,
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'Brief about this shoot...',
            },
            {
              name: 'image',
              label: 'Image',
              type: 'image',
              folder: 'portfolio',
            },
          ]}
        />
      </FormSection>

      {/* ④ SERVICES / PACKAGES */}
      <FormSection
        step={4}
        title="Packages"
        description="List your photography packages with pricing. Each becomes a card.">
        <DynamicList
          label="Packages"
          name="services"
          value={data.services || []}
          onChange={set}
          addLabel="Package"
          itemFields={[
            {
              name: 'name',
              label: 'Package Name',
              type: 'text',
              placeholder: 'e.g. Wedding Premium',
            },
            {
              name: 'category',
              label: 'Type',
              type: 'select',
              placeholder: 'Select type',
              options: PACKAGE_TYPES,
            },
            {
              name: 'price',
              label: 'Price',
              type: 'text',
              placeholder: 'e.g. ₹50,000',
            },
            {
              name: 'duration',
              label: 'Duration',
              type: 'text',
              placeholder: 'e.g. 8 hours',
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'What is included in this package...',
            },
          ]}
        />
      </FormSection>

      {/* ⑤ WHY US */}
      <FormSection
        step={5}
        title="Why Us"
        description="Highlight why clients should choose you (e.g., Creative Eye, Fast Delivery).">
        <DynamicList
          label="Features"
          name="why_us"
          value={data.why_us || []}
          onChange={set}
          addLabel="Feature"
          itemFields={[
            {
              name: 'title',
              label: 'Feature Title',
              type: 'text',
              placeholder: 'e.g. Award-Winning Photography',
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'Brief about this feature...',
            },
          ]}
        />
      </FormSection>

      {/* ⑥ REVIEWS */}
      <FormSection
        step={6}
        title="Reviews"
        description="Client testimonials that build trust.">
        <DynamicList
          label="Customer Reviews"
          name="reviews"
          value={data.reviews || []}
          onChange={set}
          addLabel="Review"
          itemFields={[
            {
              name: 'client_name',
              label: 'Client Name',
              type: 'text',
              placeholder: 'e.g. Priya S.',
            },
            {
              name: 'rating',
              label: 'Rating (1-5)',
              type: 'number',
              placeholder: 'e.g. 5',
            },
            {
              name: 'text',
              label: 'Review Text',
              type: 'textarea',
              placeholder: 'What the client said...',
            },
          ]}
        />
      </FormSection>

      {/* ⑦ GALLERY */}
      <FormSection
        step={7}
        title="Gallery"
        description="Additional images shown in the gallery section.">
        <ImageListUpload
          label="Gallery Images"
          name="gallery"
          value={data.gallery}
          onChange={set}
          folder="gallery"
        />
      </FormSection>

      {/* ⑧ CONTACT */}
      <FormSection
        step={8}
        title="Contact"
        description="Contact information shown in Contact section and footer.">
        <div className="ff-grid">
          <Field
            label="Phone Number"
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
            help="Clients can enquire via WhatsApp"
          />
          <Field
            label="Email Address"
            name="email"
            value={data.email}
            onChange={set}
            type="email"
            required
            placeholder="hello@yourstudio.com"
          />
        </div>

        <Field
          label="Studio Address"
          name="address"
          value={data.address}
          onChange={set}
          type="textarea"
          rows={2}
          placeholder="Street, Area, City, State, PIN Code"
        />

        <div className="ff-grid">
          <Field
            label="Instagram URL"
            name="social_instagram"
            value={data.social_instagram}
            onChange={set}
            type="url"
            placeholder="https://instagram.com/yourstudio"
          />
          <Field
            label="Facebook URL"
            name="social_facebook"
            value={data.social_facebook}
            onChange={set}
            type="url"
            placeholder="https://facebook.com/yourstudio"
          />
        </div>
      </FormSection>
    </div>
  )
}