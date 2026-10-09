import {
  Field, TagsInput, ImageUpload, FileUpload, DynamicList, FormSection,
} from './FormField'

export default function PortfolioForm({ data, onChange }) {
  const set = (name, value) => onChange({ ...data, [name]: value })

  return (
    <div className="cat-form">
      {/* ---- 1. Personal Info ---- */}
      <FormSection step={1} title="Personal Info"
        description="Your basic details that appear on your portfolio.">
        <div className="ff-grid">
          <Field label="Full Name" name="full_name" value={data.full_name}
            onChange={set} required placeholder="e.g. Aslam Khan" />
          <Field label="Professional Title" name="title" value={data.title}
            onChange={set} required placeholder="e.g. AWS Cloud Engineer" />
          <Field label="Email" name="email" value={data.email} type="email"
            onChange={set} required placeholder="you@example.com" />
          <Field label="Phone" name="phone" value={data.phone} type="tel"
            onChange={set} required placeholder="9876543210" />
          <Field label="Location" name="location" value={data.location}
            onChange={set} placeholder="Chennai, Tamil Nadu" />
          <Field label="Years of Experience" name="years_experience"
            value={data.years_experience} onChange={set}
            placeholder="e.g. 8+ years" />
        </div>

        <Field label="Tagline (Short Intro)" name="tagline" value={data.tagline}
          onChange={set} maxLength={120}
          placeholder="e.g. Building reliable cloud infrastructure, one commit at a time."
          help="A one-line punchy intro shown at the top of your About section." />

        <Field label="About You (Description)" name="about" value={data.about}
          type="textarea" onChange={set} required rows={5} maxLength={1200}
          placeholder="Tell visitors about yourself, your experience, and what you do." />

        <div className="ff-grid">
          <ImageUpload label="Profile Image" name="profile_image"
            value={data.profile_image} onChange={set} folder="profile" />
          <FileUpload label="Resume (PDF / DOC)" name="resume"
            value={data.resume} onChange={set} />
        </div>
      </FormSection>

      {/* ---- 2. Skills (Grouped) ---- */}
      <FormSection step={2} title="Skills"
        description="Group your skills by category (e.g. Frontend → HTML, CSS, React).">
        <SkillsGroupInput
          value={data.skills}
          onChange={(v) => set('skills', v)}
        />
      </FormSection>

      {/* ---- 3. Experience ---- */}
      <FormSection step={3} title="Work Experience"
        description="Add your professional journey. You can add multiple entries.">
        <DynamicList
          label="Experience"
          name="experience"
          value={data.experience || []}
          onChange={set}
          addLabel="Experience"
          itemFields={[
            { name: 'company', label: 'Company Name', type: 'text', placeholder: 'e.g. Google, TCS, Freelance' },
            { name: 'role', label: 'Your Role / Designation', type: 'text', placeholder: 'e.g. Senior Developer' },
            { name: 'domain', label: 'Domain / Industry', type: 'text', placeholder: 'e.g. Fintech, E-commerce, Healthcare' },
            { name: 'from_period', label: 'From (Month Year)', type: 'text', placeholder: 'e.g. Jan 2020' },
            { name: 'to_period', label: 'To (Month Year)', type: 'text', placeholder: 'e.g. Present / Dec 2023' },
            { name: 'description', label: 'What did you do?', type: 'textarea', placeholder: 'Key responsibilities and achievements' },
          ]}
        />
      </FormSection>

      {/* ---- 4. Projects ---- */}
      <FormSection step={4} title="Projects"
        description="Showcase your best work. Add multiple projects.">
        <DynamicList
          label="Projects"
          name="projects"
          value={data.projects || []}
          onChange={set}
          addLabel="Project"
          itemFields={[
            { name: 'name', label: 'Project Name', type: 'text', placeholder: 'My Awesome App' },
            { name: 'url', label: 'Live Link (Optional)', type: 'url', placeholder: 'https://...' },
            { name: 'image', label: 'Project Image', type: 'image' },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'What does this project do?' },
          ]}
        />
      </FormSection>

      {/* ---- 5. Contact ---- */}
      <FormSection step={5} title="Contact Information"
        description="Professional contact details and WhatsApp for direct messaging.">
        <div className="ff-grid">
          <Field label="Contact Person Name" name="contact_name"
            value={data.contact_name} onChange={set}
            placeholder="e.g. Aslam Khan" />
          <Field label="Contact Email" name="contact_email" value={data.contact_email}
            type="email" onChange={set} placeholder="hello@example.com" />
          <Field label="Contact Phone" name="contact_phone" value={data.contact_phone}
            type="tel" onChange={set} placeholder="9876543210" />
          <Field label="WhatsApp Number" name="whatsapp"
            value={data.whatsapp} type="tel" onChange={set}
            placeholder="9876543210"
            help="Visitors can chat with you directly via WhatsApp" />
        </div>
        <Field label="Address" name="address" value={data.address}
          type="textarea" rows={2} onChange={set}
          placeholder="Street, City, State, PIN" />
        <Field label="Working Hours (Optional)" name="working_hours"
          value={data.working_hours} onChange={set}
          placeholder="e.g. Mon–Fri, 10 AM – 7 PM" />
      </FormSection>

      {/* ---- 6. Social Links ---- */}
      <FormSection step={6} title="Social Links"
        description="Optional — connect your social profiles.">
        <div className="ff-grid">
          <Field label="LinkedIn" name="social_linkedin" value={data.social_linkedin}
            onChange={set} type="url" placeholder="https://linkedin.com/in/..." />
          <Field label="GitHub" name="social_github" value={data.social_github}
            onChange={set} type="url" placeholder="https://github.com/..." />
          <Field label="Twitter / X" name="social_twitter" value={data.social_twitter}
            onChange={set} type="url" placeholder="https://twitter.com/..." />
        </div>
      </FormSection>
    </div>
  )
}

/* ============================================================
   Skills Group Input — category + items
   ============================================================ */
function SkillsGroupInput({ value, onChange }) {
  // Backward compat: convert old flat array to grouped
  let groups = []
  if (Array.isArray(value) && value.length > 0) {
    if (typeof value[0] === 'string') {
      groups = [{ category: 'Skills', items: value }]
    } else {
      groups = value
    }
  }

  const update = (next) => onChange(next)

  const addGroup = () => {
    update([...groups, { category: '', items: [] }])
  }
  const updateGroupCategory = (i, val) => {
    const copy = [...groups]
    copy[i] = { ...copy[i], category: val }
    update(copy)
  }
  const removeGroup = (i) => update(groups.filter((_, x) => x !== i))

  const addSkill = (i, skill) => {
    const copy = [...groups]
    copy[i] = { ...copy[i], items: [...(copy[i].items || []), skill] }
    update(copy)
  }
  const removeSkill = (i, si) => {
    const copy = [...groups]
    copy[i] = { ...copy[i], items: copy[i].items.filter((_, x) => x !== si) }
    update(copy)
  }

  return (
    <div className="skgroup-wrap">
      {groups.length === 0 && (
        <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
          No skills yet. Click "Add Category" below to start.
        </p>
      )}

      {groups.map((g, i) => (
        <div key={i} className="skgroup">
          <div className="skgroup-head">
            <input
              type="text"
              className="skgroup-cat"
              placeholder="Category name (e.g. Frontend, Backend, Cloud)"
              value={g.category}
              onChange={(e) => updateGroupCategory(i, e.target.value)}
            />
            <button type="button" className="skgroup-remove"
              onClick={() => removeGroup(i)} title="Remove category">
              ×
            </button>
          </div>

          <div className="skgroup-items">
            {(g.items || []).map((s, si) => (
              <span key={si} className="skgroup-tag">
                {s}
                <button type="button" onClick={() => removeSkill(i, si)}>×</button>
              </span>
            ))}
            <input
              type="text"
              className="skgroup-input"
              placeholder="Type a skill + Enter (e.g. React, AWS, Python)"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  e.preventDefault()
                  addSkill(i, e.target.value.trim())
                  e.target.value = ''
                }
              }}
            />
          </div>

          <div className="skgroup-hint">
            Tip: type "React" → logo automatic-a match aagum template la.
          </div>
        </div>
      ))}

      <button type="button" className="skgroup-add" onClick={addGroup}>
        + Add Category
      </button>
    </div>
  )
}