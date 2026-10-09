import {
  Field, ImageUpload, ImageListUpload, DynamicList, FormSection,
} from './FormField'

const PROGRAM_TYPES = [
  'Strength Training', 'Cardio', 'CrossFit', 'Yoga', 'Zumba',
  'HIIT', 'Pilates', 'Boxing', 'MMA', 'Personal Training',
  'Bodybuilding', 'Functional Training', 'Other',
]

const PLAN_DURATIONS = [
  'Monthly', 'Quarterly', 'Half Yearly', 'Yearly', 'Lifetime',
]

const SPECIALIZATIONS = [
  'Strength Coach', 'Nutritionist', 'Yoga Instructor', 'CrossFit Coach',
  'Personal Trainer', 'Physiotherapist', 'Boxing Coach', 'Zumba Instructor',
  'Other',
]

export default function GymForm({ data, onChange }) {
  const set = (name, value) => onChange({ ...data, [name]: value })

  return (
    <div className="cat-form">

      {/* ① HOME */}
      <FormSection
        step={1}
        title="Home"
        description="Hero section — first impression of your gym.">
        <div className="ff-grid">
          <Field
            label="Gym / Fitness Studio Name"
            name="gym_name"
            value={data.gym_name}
            onChange={set}
            required
            placeholder="e.g. Iron Empire Fitness"
          />
          <Field
            label="Tagline / Headline"
            name="tagline"
            value={data.tagline}
            onChange={set}
            placeholder="e.g. Train Hard. Get Stronger."
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
          placeholder="Short intro about your gym — equipment, trainers, atmosphere..."
        />

        <ImageUpload
          label="Gym Logo"
          name="logo"
          value={data.logo}
          onChange={set}
          folder="logo"
        />

        <div className="ff-grid">
          <Field
            label="Total Members"
            name="total_members"
            value={data.total_members}
            onChange={set}
            placeholder="e.g. 1500"
            help="Shown as '1500+ Members' on hero"
          />
          <Field
            label="Expert Trainers"
            name="total_trainers"
            value={data.total_trainers}
            onChange={set}
            placeholder="e.g. 15"
            help="Shown as '15+ Expert Trainers' on hero"
          />
          <Field
            label="Years in Business"
            name="years_experience"
            value={data.years_experience}
            onChange={set}
            placeholder="e.g. 10"
            help="Shown as '10+ Years' on hero"
          />
        </div>
      </FormSection>

      {/* ② ABOUT */}
      <FormSection
        step={2}
        title="About"
        description="Detailed info about your gym shown in About section.">
        <Field
          label="About Gym (Full Description)"
          name="about_full"
          value={data.about_full}
          onChange={set}
          type="textarea"
          rows={5}
          maxLength={1500}
          placeholder="Detailed description about your gym — mission, facilities, equipment, community..."
        />

        <div className="ff-grid">
          <Field
            label="Founder / Head Coach"
            name="director_name"
            value={data.director_name}
            onChange={set}
            placeholder="e.g. Arjun Sharma"
          />
          <Field
            label="Opening Hours"
            name="working_hours"
            value={data.working_hours}
            onChange={set}
            placeholder="e.g. Mon–Sun, 5 AM – 11 PM"
          />
        </div>

        <ImageUpload
          label="Founder / Head Coach Photo"
          name="profile_image"
          value={data.profile_image}
          onChange={set}
          folder="profile"
        />

        <div className="ff-grid">
          <Field
            label="Facilities Count"
            name="facilities_count"
            value={data.facilities_count}
            onChange={set}
            placeholder="e.g. 50"
            help="Number of equipment/facilities"
          />
          <Field
            label="Free Trial Days"
            name="trial_days"
            value={data.trial_days}
            onChange={set}
            placeholder="e.g. 7"
            help="Free trial period offered"
          />
        </div>
      </FormSection>

      {/* ③ PROGRAMS */}
      <FormSection
        step={3}
        title="Programs / Classes"
        description="List your workout programs. Each becomes an animated card.">
        <DynamicList
          label="Programs"
          name="programs"
          value={data.programs || []}
          onChange={set}
          addLabel="Program"
          itemFields={[
            {
              name: 'name',
              label: 'Program Name',
              type: 'text',
              placeholder: 'e.g. Strength Training',
            },
            {
              name: 'category',
              label: 'Category',
              type: 'select',
              placeholder: 'Select category',
              options: PROGRAM_TYPES,
            },
            {
              name: 'duration',
              label: 'Duration',
              type: 'text',
              placeholder: 'e.g. 60 min',
            },
            {
              name: 'level',
              label: 'Level',
              type: 'text',
              placeholder: 'e.g. Beginner / Advanced',
            },
            {
              name: 'price',
              label: 'Price (optional)',
              type: 'text',
              placeholder: 'e.g. ₹1500/month',
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'What this program includes...',
            },
            {
              name: 'image',
              label: 'Program Image',
              type: 'image',
              folder: 'programs',
            },
          ]}
        />
      </FormSection>

      {/* ④ TRAINERS */}
      <FormSection
        step={4}
        title="Trainers / Coaches"
        description="Add your trainers with photos, specialization, and experience.">
        <DynamicList
          label="Trainers"
          name="trainers"
          value={data.trainers || []}
          onChange={set}
          addLabel="Trainer"
          itemFields={[
            {
              name: 'name',
              label: 'Trainer Name',
              type: 'text',
              placeholder: 'e.g. Rahul Verma',
            },
            {
              name: 'specialization',
              label: 'Specialization',
              type: 'select',
              placeholder: 'Select specialization',
              options: SPECIALIZATIONS,
            },
            {
              name: 'experience',
              label: 'Experience',
              type: 'text',
              placeholder: 'e.g. 8+ years',
            },
            {
              name: 'certifications',
              label: 'Certifications',
              type: 'text',
              placeholder: 'e.g. ACE, NASM, CrossFit L2',
            },
            {
              name: 'bio',
              label: 'Short Bio',
              type: 'textarea',
              placeholder: 'Brief about the trainer...',
            },
            {
              name: 'image',
              label: 'Photo',
              type: 'image',
              folder: 'trainers',
            },
          ]}
        />
      </FormSection>

      {/* ⑤ MEMBERSHIP PLANS */}
      <FormSection
        step={5}
        title="Membership Plans"
        description="Pricing plans for gym membership.">
        <DynamicList
          label="Plans"
          name="plans"
          value={data.plans || []}
          onChange={set}
          addLabel="Plan"
          itemFields={[
            {
              name: 'name',
              label: 'Plan Name',
              type: 'text',
              placeholder: 'e.g. Pro Plan',
            },
            {
              name: 'duration',
              label: 'Duration',
              type: 'select',
              placeholder: 'Select duration',
              options: PLAN_DURATIONS,
            },
            {
              name: 'price',
              label: 'Price',
              type: 'text',
              placeholder: 'e.g. ₹2,999',
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'What this plan includes...',
            },
            {
              name: 'is_popular',
              label: 'Mark as Popular (yes/no)',
              type: 'text',
              placeholder: 'e.g. yes',
            },
          ]}
        />
      </FormSection>

      {/* ⑥ WHY US */}
      <FormSection
        step={6}
        title="Why Choose Us"
        description="Highlight what makes your gym special.">
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
              placeholder: 'e.g. State-of-the-art Equipment',
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

      {/* ⑦ REVIEWS */}
      <FormSection
        step={7}
        title="Member Reviews"
        description="Testimonials from your gym members.">
        <DynamicList
          label="Reviews"
          name="reviews"
          value={data.reviews || []}
          onChange={set}
          addLabel="Review"
          itemFields={[
            {
              name: 'member_name',
              label: 'Member Name',
              type: 'text',
              placeholder: 'e.g. Priya S.',
            },
            {
              name: 'plan',
              label: 'Membership Type',
              type: 'text',
              placeholder: 'e.g. Pro Plan',
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
              placeholder: 'What the member said...',
            },
          ]}
        />
      </FormSection>

      {/* ⑧ GALLERY */}
      <FormSection
        step={8}
        title="Gallery"
        description="Gym interior, equipment, action shots.">
        <ImageListUpload
          label="Gallery Images"
          name="gallery"
          value={data.gallery}
          onChange={set}
          folder="gallery"
          help="Recommended: high-energy action shots + gym interiors"
        />
      </FormSection>

      {/* ⑨ CONTACT */}
      <FormSection
        step={9}
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
            help="Members can join via WhatsApp"
          />
          <Field
            label="Email Address"
            name="email"
            value={data.email}
            onChange={set}
            type="email"
            required
            placeholder="info@yourgym.com"
          />
        </div>

        <Field
          label="Gym Address"
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
            placeholder="https://instagram.com/yourgym"
          />
          <Field
            label="Facebook URL"
            name="social_facebook"
            value={data.social_facebook}
            onChange={set}
            type="url"
            placeholder="https://facebook.com/yourgym"
          />
        </div>
      </FormSection>
    </div>
  )
}