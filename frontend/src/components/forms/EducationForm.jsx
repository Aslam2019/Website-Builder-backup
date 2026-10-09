import {
  Field, ImageUpload, ImageListUpload, DynamicList, FormSection,
} from './FormField'

const COURSE_CATEGORIES = [
  'Web Development', 'Mobile Development', 'Data Science', 'AI / ML',
  'Cloud Computing', 'DevOps', 'Cyber Security', 'UI / UX Design',
  'Digital Marketing', 'Blockchain', 'Other',
]

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
const MODES = ['Online', 'Offline', 'Hybrid']

export default function EducationForm({ data, onChange }) {
  const set = (name, value) => onChange({ ...data, [name]: value })

  return (
    <div className="cat-form">

      {/* ① HOME */}
      <FormSection
        step={1}
        title="Home"
        description="Hero section — first impression of your institute.">
        <div className="ff-grid">
          <Field
            label="Institute / Academy Name"
            name="institute_name"
            value={data.institute_name}
            onChange={set}
            required
            placeholder="e.g. CodeCraft Academy"
          />
          <Field
            label="Tagline / Headline"
            name="tagline"
            value={data.tagline}
            onChange={set}
            placeholder="e.g. Master Coding. Land Your Dream Job."
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
          placeholder="Short intro about your academy, teaching approach, and outcomes..."
        />

        <ImageUpload
          label="Institute Logo"
          name="logo"
          value={data.logo}
          onChange={set}
          folder="logo"
        />

        <div className="ff-grid">
          <Field
            label="Students Trained"
            name="students_trained"
            value={data.students_trained}
            onChange={set}
            placeholder="e.g. 5000"
            help="Shown as '5000+ Students' on hero"
          />
          <Field
            label="Placement Rate %"
            name="placement_rate"
            value={data.placement_rate}
            onChange={set}
            placeholder="e.g. 95"
            help="Shown as '95% Placement' on hero"
          />
        </div>
      </FormSection>

      {/* ② ABOUT */}
      <FormSection
        step={2}
        title="About"
        description="Detailed info about your academy shown in About section.">
        <Field
          label="About Institute (Full Description)"
          name="about_full"
          value={data.about_full}
          onChange={set}
          type="textarea"
          rows={5}
          maxLength={1500}
          placeholder="Detailed description about your institute — mission, teaching methodology, mentors, success stories..."
        />

        <div className="ff-grid">
          <Field
            label="Years of Experience"
            name="years_experience"
            value={data.years_experience}
            onChange={set}
            placeholder="e.g. 8"
          />
          <Field
            label="Total Courses"
            name="total_courses"
            value={data.total_courses}
            onChange={set}
            placeholder="e.g. 25"
          />
        </div>

        <ImageUpload
          label="Founder / Director Photo"
          name="profile_image"
          value={data.profile_image}
          onChange={set}
          folder="profile"
        />

        <div className="ff-grid">
          <Field
            label="Director Name"
            name="director_name"
            value={data.director_name}
            onChange={set}
            placeholder="e.g. Arjun Kumar"
          />
          <Field
            label="Working Hours"
            name="working_hours"
            value={data.working_hours}
            onChange={set}
            placeholder="e.g. Mon–Sat, 9 AM – 8 PM"
          />
        </div>
      </FormSection>

      {/* ③ COURSES */}
      <FormSection
        step={3}
        title="Courses"
        description="List all courses with pricing. Each becomes a card.">
        <DynamicList
          label="Courses"
          name="courses"
          value={data.courses || []}
          onChange={set}
          addLabel="Course"
          itemFields={[
            {
              name: 'name',
              label: 'Course Name',
              type: 'text',
              placeholder: 'e.g. Full Stack Web Development',
            },
            {
              name: 'category',
              label: 'Category',
              type: 'select',
              placeholder: 'Select category',
              options: COURSE_CATEGORIES,
            },
            {
              name: 'level',
              label: 'Level',
              type: 'select',
              placeholder: 'Select level',
              options: LEVELS,
            },
            {
              name: 'mode',
              label: 'Mode',
              type: 'select',
              placeholder: 'Select mode',
              options: MODES,
            },
            {
              name: 'duration',
              label: 'Duration',
              type: 'text',
              placeholder: 'e.g. 6 months',
            },
            {
              name: 'price',
              label: 'Price',
              type: 'text',
              placeholder: 'e.g. ₹45,000',
            },
            {
              name: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'What you will learn, projects, tools covered...',
            },
          ]}
        />
      </FormSection>

      {/* ④ FEATURES / WHY US */}
      <FormSection
        step={4}
        title="Why Us"
        description="Highlight what makes your academy special.">
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
              placeholder: 'e.g. 100% Placement Support',
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

      {/* ⑤ MENTORS */}
      <FormSection
        step={5}
        title="Mentors / Faculty"
        description="Add your instructors with photo, name, and expertise.">
        <DynamicList
          label="Mentors"
          name="mentors"
          value={data.mentors || []}
          onChange={set}
          addLabel="Mentor"
          itemFields={[
            {
              name: 'name',
              label: 'Mentor Name',
              type: 'text',
              placeholder: 'e.g. Ravi Sharma',
            },
            {
              name: 'role',
              label: 'Role / Title',
              type: 'text',
              placeholder: 'e.g. Senior Full Stack Developer',
            },
            {
              name: 'experience',
              label: 'Experience',
              type: 'text',
              placeholder: 'e.g. 8+ years',
            },
            {
              name: 'expertise',
              label: 'Expertise',
              type: 'text',
              placeholder: 'e.g. React, Node.js, AWS',
            },
            {
              name: 'image',
              label: 'Photo',
              type: 'image',
              folder: 'mentors',
            },
          ]}
        />
      </FormSection>

      {/* ⑥ TESTIMONIALS */}
      <FormSection
        step={6}
        title="Reviews"
        description="Student testimonials that build trust.">
        <DynamicList
          label="Student Reviews"
          name="reviews"
          value={data.reviews || []}
          onChange={set}
          addLabel="Review"
          itemFields={[
            {
              name: 'student_name',
              label: 'Student Name',
              type: 'text',
              placeholder: 'e.g. Priya S.',
            },
            {
              name: 'course',
              label: 'Course Taken',
              type: 'text',
              placeholder: 'e.g. Full Stack Web Development',
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
              placeholder: 'What the student said...',
            },
          ]}
        />
      </FormSection>

      {/* ⑦ GALLERY */}
      <FormSection
        step={7}
        title="Gallery"
        description="Campus, classroom, events photos.">
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
            help="Students can enquire via WhatsApp"
          />
          <Field
            label="Email Address"
            name="email"
            value={data.email}
            onChange={set}
            type="email"
            required
            placeholder="hello@youracademy.com"
          />
        </div>

        <Field
          label="Institute Address"
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
            placeholder="https://instagram.com/youracademy"
          />
          <Field
            label="Facebook URL"
            name="social_facebook"
            value={data.social_facebook}
            onChange={set}
            type="url"
            placeholder="https://facebook.com/youracademy"
          />
        </div>
      </FormSection>
    </div>
  )
}