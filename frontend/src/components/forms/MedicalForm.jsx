import {
  Field, ImageUpload, ImageListUpload, DynamicList, FormSection,
} from './FormField'

const DEPARTMENTS = [
  'General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics',
  'Dermatology', 'Neurology', 'Gynecology', 'ENT', 'Ophthalmology',
  'Dentistry', 'Psychiatry', 'Physiotherapy', 'Emergency', 'Other',
]

const SPECIALIZATIONS = [
  'MBBS', 'MD', 'MS', 'DM', 'MCh', 'BDS', 'MDS', 'BAMS', 'BHMS',
  'DNB', 'PhD', 'Other',
]

export default function MedicalForm({ data, onChange }) {
  const set = (name, value) => onChange({ ...data, [name]: value })

  return (
    <div className="cat-form">

      {/* ① HOME */}
      <FormSection
        step={1}
        title="Home"
        description="Hero section — first impression of your clinic or hospital.">
        <div className="ff-grid">
          <Field
            label="Clinic / Hospital Name"
            name="clinic_name"
            value={data.clinic_name}
            onChange={set}
            required
            placeholder="e.g. Sunrise Multispeciality Clinic"
          />
          <Field
            label="Tagline / Headline"
            name="tagline"
            value={data.tagline}
            onChange={set}
            placeholder="e.g. Care that feels personal"
            help="Shown as the big hero headline"
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
          placeholder="Short intro about your clinic — specialties, doctors, patient care philosophy..."
        />

        <ImageUpload
          label="Clinic Logo"
          name="logo"
          value={data.logo}
          onChange={set}
          folder="logo"
        />

        <div className="ff-grid">
          <Field
            label="Happy Patients"
            name="happy_patients"
            value={data.happy_patients}
            onChange={set}
            placeholder="e.g. 10000"
            help="Shown as '10000+ Happy Patients' on hero stats"
          />
          <Field
            label="Years of Service"
            name="years_experience"
            value={data.years_experience}
            onChange={set}
            placeholder="e.g. 15"
            help="Shown as '15+ Years of Service' on hero stats"
          />
          <Field
            label="Expert Doctors Count"
            name="total_doctors"
            value={data.total_doctors}
            onChange={set}
            placeholder="e.g. 12"
            help="Shown as '12+ Expert Doctors' on hero stats"
          />
        </div>
      </FormSection>

      {/* ② ABOUT */}
      <FormSection
        step={2}
        title="About"
        description="Detailed info about your clinic shown in About section.">
        <Field
          label="About Clinic (Full Description)"
          name="about_full"
          value={data.about_full}
          onChange={set}
          type="textarea"
          rows={5}
          maxLength={1500}
          placeholder="Detailed description about your clinic — mission, facilities, specialities, technology..."
        />

        <div className="ff-grid">
          <Field
            label="Chief Doctor / Director Name"
            name="director_name"
            value={data.director_name}
            onChange={set}
            placeholder="e.g. Dr. Rajesh Kumar"
            help="Shown as 'Chief Doctor' in About section"
          />
          <Field
            label="Working Hours"
            name="working_hours"
            value={data.working_hours}
            onChange={set}
            placeholder="e.g. Mon–Sat, 9 AM – 9 PM"
          />
        </div>

        <ImageUpload
          label="Chief Doctor Photo"
          name="profile_image"
          value={data.profile_image}
          onChange={set}
          folder="profile"
          help="Used in hero if no doctor image available"
        />

        <div className="ff-grid">
          <Field
            label="Emergency Number"
            name="emergency_phone"
            value={data.emergency_phone}
            onChange={set}
            type="tel"
            placeholder="e.g. 9876543210"
            help="Shown in navbar + contact as 24/7 emergency"
          />
          <Field
            label="Ambulance Available"
            name="ambulance"
            value={data.ambulance}
            onChange={set}
            placeholder="e.g. Yes / No"
            help="Optional — displayed as trust signal"
          />
        </div>
      </FormSection>

      {/* ③ SERVICES */}
      <FormSection
        step={3}
        title="Services / Treatments"
        description="List all medical services with pricing. Each becomes an editorial row.">
        <DynamicList
          label="Services"
          name="services"
          value={data.services || []}
          onChange={set}
          addLabel="Service"
          itemFields={[
            {
              name: 'name',
              label: 'Service / Treatment Name',
              type: 'text',
              placeholder: 'e.g. Cardiac Checkup',
            },
            {
              name: 'category',
              label: 'Department',
              type: 'select',
              placeholder: 'Select department',
              options: DEPARTMENTS,
            },
            {
              name: 'duration',
              label: 'Duration',
              type: 'text',
              placeholder: 'e.g. 45 min',
            },
            {
              name: 'price',
              label: 'Price / Consultation Fee',
              type: 'text',
              placeholder: 'e.g. ₹800',
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'What this treatment includes...',
            },
          ]}
        />
      </FormSection>

      {/* ④ DOCTORS */}
      <FormSection
        step={4}
        title="Doctors / Specialists"
        description="Add your doctors. Photos will show as circular cards in a team grid.">
        <DynamicList
          label="Doctors"
          name="doctors"
          value={data.doctors || []}
          onChange={set}
          addLabel="Doctor"
          itemFields={[
            {
              name: 'name',
              label: 'Doctor Name',
              type: 'text',
              placeholder: 'e.g. Dr. Priya Sharma',
            },
            {
              name: 'specialization',
              label: 'Specialization / Qualification',
              type: 'select',
              placeholder: 'Select qualification',
              options: SPECIALIZATIONS,
            },
            {
              name: 'department',
              label: 'Department',
              type: 'select',
              placeholder: 'Select department',
              options: DEPARTMENTS,
            },
            {
              name: 'experience',
              label: 'Experience',
              type: 'text',
              placeholder: 'e.g. 12+ years',
            },
            {
              name: 'bio',
              label: 'Short Bio',
              type: 'textarea',
              placeholder: 'Brief about the doctor...',
            },
            {
              name: 'image',
              label: 'Photo',
              type: 'image',
              folder: 'doctors',
              help: 'Square or circular photos work best',
            },
          ]}
        />
      </FormSection>

      {/* ⑤ WHY US / FEATURES */}
      <FormSection
        step={5}
        title="Why Choose Us"
        description="Highlight what makes your clinic special (e.g., Advanced Equipment, 24/7 Care).">
        <DynamicList
          label="Features"
          name="features"
          value={data.features || []}
          onChange={set}
          addLabel="Feature"
          itemFields={[
            {
              name: 'title',
              label: 'Feature Title',
              type: 'text',
              placeholder: 'e.g. Advanced Diagnostic Lab',
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
        title="Patient Reviews"
        description="Patient testimonials that build trust.">
        <DynamicList
          label="Reviews"
          name="reviews"
          value={data.reviews || []}
          onChange={set}
          addLabel="Review"
          itemFields={[
            {
              name: 'patient_name',
              label: 'Patient Name',
              type: 'text',
              placeholder: 'e.g. Ramesh S.',
            },
            {
              name: 'treatment',
              label: 'Treatment Taken',
              type: 'text',
              placeholder: 'e.g. Cardiac Checkup',
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
              placeholder: 'What the patient said...',
            },
          ]}
        />
      </FormSection>

      {/* ⑦ GALLERY */}
      <FormSection
        step={7}
        title="Gallery"
        description="Clinic interior, facilities, equipment photos. Shows as horizontal scrolling strip.">
        <ImageListUpload
          label="Gallery Images"
          name="gallery"
          value={data.gallery}
          onChange={set}
          folder="gallery"
          help="Recommended: portrait or square photos, at least 4-6 images"
        />
      </FormSection>

      {/* ⑧ CONTACT */}
      <FormSection
        step={8}
        title="Contact"
        description="Contact info shown in Contact section and footer.">
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
            help="Patients can book appointments via WhatsApp"
          />
          <Field
            label="Email Address"
            name="email"
            value={data.email}
            onChange={set}
            type="email"
            required
            placeholder="care@yourclinic.com"
          />
        </div>

        <Field
          label="Clinic Address"
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
            placeholder="https://instagram.com/yourclinic"
          />
          <Field
            label="Facebook URL"
            name="social_facebook"
            value={data.social_facebook}
            onChange={set}
            type="url"
            placeholder="https://facebook.com/yourclinic"
          />
        </div>
      </FormSection>
    </div>
  )
}