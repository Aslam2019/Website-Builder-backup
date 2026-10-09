import {
  Field, ImageUpload, ImageListUpload, DynamicList, FormSection,
} from './FormField'

const SERVICE_CATEGORIES = [
  'Hair', 'Skin', 'Nails', 'Massage', 'Spa', 'Makeup',
  'Bridal', 'Grooming', 'Waxing', 'Threading', 'Other',
]

export default function SalonForm({ data, onChange }) {
  const set = (name, value) => onChange({ ...data, [name]: value })

  return (
    <div className="cat-form">

      {/* ① HOME */}
      <FormSection
        step={1}
        title="Home"
        description="Hero section — the first thing visitors see.">
        <div className="ff-grid">
          <Field
            label="Salon Name"
            name="salon_name"
            value={data.salon_name}
            onChange={set}
            required
            placeholder="e.g. Glow Studio"
          />
          <Field
            label="Tagline / Headline"
            name="tagline"
            value={data.tagline}
            onChange={set}
            placeholder="e.g. Where Beauty Meets Elegance"
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
          placeholder="Short intro about your salon — services, atmosphere, expertise..."
        />

        <ImageUpload
          label="Salon Logo"
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
            placeholder="e.g. 5000"
            help="Shown as '5000+ Happy Clients' on hero"
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
        description="Detailed info about your salon shown in the About section.">
        <Field
          label="About Salon (Full Description)"
          name="about_full"
          value={data.about_full}
          onChange={set}
          type="textarea"
          rows={5}
          maxLength={1500}
          placeholder="Detailed description about your salon — philosophy, specialities, team, what makes you unique..."
        />

        <div className="ff-grid">
          <Field
            label="Working Hours"
            name="working_hours"
            value={data.working_hours}
            onChange={set}
            placeholder="e.g. Mon–Sun, 9 AM – 9 PM"
          />
          <Field
            label="Appointment Info"
            name="appointment_info"
            value={data.appointment_info}
            onChange={set}
            placeholder="e.g. Walk-ins welcome. Booking recommended."
          />
        </div>
      </FormSection>

      {/* ③ SERVICES */}
      <FormSection
        step={3}
        title="Services"
        description="List your beauty services with pricing. Each becomes a card.">
        <DynamicList
          label="Services"
          name="services"
          value={data.services || []}
          onChange={set}
          addLabel="Service"
          itemFields={[
            {
              name: 'name',
              label: 'Service Name',
              type: 'text',
              placeholder: 'e.g. Haircut & Styling',
            },
            {
              name: 'category',
              label: 'Category',
              type: 'select',
              placeholder: 'Select category',
              options: SERVICE_CATEGORIES,
            },
            {
              name: 'price',
              label: 'Price',
              type: 'text',
              placeholder: 'e.g. ₹800',
            },
            {
              name: 'duration',
              label: 'Duration',
              type: 'text',
              placeholder: 'e.g. 45 min',
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'Brief about this service — what it includes...',
            },
          ]}
        />
      </FormSection>

      {/* ④ WHY US (NEW) */}
      <FormSection
        step={4}
        title="Why Us"
        description="Highlight why clients should choose your salon (e.g. Expert Stylists, Premium Products).">
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
              placeholder: 'e.g. Expert Stylists',
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

      {/* ⑤ REVIEWS (NEW) */}
      <FormSection
        step={5}
        title="Reviews"
        description="Add customer testimonials to build trust. Shown in the Reviews section.">
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

      {/* ⑥ GALLERY */}
      <FormSection
        step={6}
        title="Gallery"
        description="Show off your salon interior and work. Add multiple images.">
        <ImageListUpload
          label="Gallery Images"
          name="gallery"
          value={data.gallery}
          onChange={set}
          folder="gallery"
        />
      </FormSection>

      {/* ⑦ CONTACT */}
      <FormSection
        step={7}
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
            help="Clients can book appointments via WhatsApp"
          />
          <Field
            label="Email Address"
            name="email"
            value={data.email}
            onChange={set}
            type="email"
            required
            placeholder="hello@yoursalon.com"
          />
        </div>

        <Field
          label="Salon Address"
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
            placeholder="https://instagram.com/yoursalon"
          />
          <Field
            label="Facebook URL"
            name="social_facebook"
            value={data.social_facebook}
            onChange={set}
            type="url"
            placeholder="https://facebook.com/yoursalon"
          />
        </div>
      </FormSection>
    </div>
  )
}