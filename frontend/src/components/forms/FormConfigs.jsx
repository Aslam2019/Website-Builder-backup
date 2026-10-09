/**
 * Category-specific form configuration.
 * Each config = sections of fields for a category.
 * Field types: text | email | tel | url | textarea | image | file | list | tags
 */

export const FORM_CONFIGS = {
  'portfolio': {
    title: 'Portfolio Details',
    sections: [
      {
        title: 'Personal Info',
        fields: [
          { name: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
          { name: 'title', label: 'Professional Title', type: 'text', required: true, placeholder: 'UI/UX Designer' },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '9876543210' },
          { name: 'profile_image', label: 'Profile Image', type: 'image', folder: 'profile' },
          { name: 'resume', label: 'Resume (PDF/DOC)', type: 'file', folder: 'resume' },
          { name: 'about', label: 'About You', type: 'textarea', required: true, rows: 4, maxLength: 800 },
          { name: 'location', label: 'Location', type: 'text', placeholder: 'Chennai, India' },
        ],
      },
      {
        title: 'Skills',
        fields: [
          { name: 'skills', label: 'Skills', type: 'tags', placeholder: 'Type a skill + Enter' },
        ],
      },
      {
        title: 'Projects',
        fields: [
          { name: 'projects', label: 'Projects', type: 'list', itemFields: [
            { name: 'name', label: 'Project Name', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
            { name: 'url', label: 'Project URL', type: 'url' },
            { name: 'image', label: 'Project Image', type: 'image', folder: 'project' },
          ]},
        ],
      },
      {
        title: 'Social Links',
        fields: [
          { name: 'social_linkedin', label: 'LinkedIn URL', type: 'url' },
          { name: 'social_github', label: 'GitHub URL', type: 'url' },
          { name: 'social_twitter', label: 'Twitter URL', type: 'url' },
        ],
      },
    ],
  },

  'real-estate': {
    title: 'Real Estate Details',
    sections: [
      {
        title: 'Company Info',
        fields: [
          { name: 'company_name', label: 'Company Name', type: 'text', required: true },
          { name: 'logo', label: 'Company Logo', type: 'image', folder: 'logo' },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Contact Number', type: 'tel', required: true },
          { name: 'address', label: 'Address', type: 'text' },
          { name: 'about', label: 'About Company', type: 'textarea', required: true, rows: 4 },
        ],
      },
      {
        title: 'Properties',
        fields: [
          { name: 'properties', label: 'Properties', type: 'list', itemFields: [
            { name: 'name', label: 'Property Name', type: 'text' },
            { name: 'type', label: 'Property Type', type: 'text', placeholder: 'Villa / Apartment / Plot' },
            { name: 'price', label: 'Price', type: 'text', placeholder: '₹1.2 Cr' },
            { name: 'location', label: 'Location', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
            { name: 'image', label: 'Property Image', type: 'image', folder: 'property' },
          ]},
        ],
      },
    ],
  },

  'salon-spa': {
    title: 'Salon & Spa Details',
    sections: [
      {
        title: 'Salon Info',
        fields: [
          { name: 'salon_name', label: 'Salon Name', type: 'text', required: true },
          { name: 'logo', label: 'Logo', type: 'image', folder: 'logo' },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', required: true },
          { name: 'address', label: 'Address', type: 'text' },
          { name: 'working_hours', label: 'Working Hours', type: 'text', placeholder: 'Mon–Sun, 9 AM – 9 PM' },
          { name: 'about', label: 'About', type: 'textarea', required: true, rows: 4 },
          { name: 'appointment_info', label: 'Appointment Info', type: 'textarea', rows: 3 },
        ],
      },
      {
        title: 'Services',
        fields: [
          { name: 'services', label: 'Services', type: 'list', itemFields: [
            { name: 'name', label: 'Service Name', type: 'text' },
            { name: 'price', label: 'Price', type: 'text' },
            { name: 'duration', label: 'Duration', type: 'text', placeholder: '45 min' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
          ]},
        ],
      },
      {
        title: 'Gallery',
        fields: [
          { name: 'gallery', label: 'Gallery Images', type: 'image-list', folder: 'gallery' },
        ],
      },
    ],
  },

  'photography': {
    title: 'Photography Details',
    sections: [
      {
        title: 'Photographer Info',
        fields: [
          { name: 'photographer_name', label: 'Photographer Name', type: 'text', required: true },
          { name: 'profile_image', label: 'Profile Image', type: 'image', folder: 'profile' },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', type: 'tel', required: true },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'experience', label: 'Experience', type: 'text', placeholder: '8+ years' },
          { name: 'about', label: 'About', type: 'textarea', required: true, rows: 4 },
        ],
      },
      {
        title: 'Portfolio Images',
        fields: [
          { name: 'portfolio_images', label: 'Portfolio Images', type: 'image-list', folder: 'portfolio' },
        ],
      },
      {
        title: 'Packages',
        fields: [
          { name: 'packages', label: 'Packages', type: 'list', itemFields: [
            { name: 'name', label: 'Package Name', type: 'text' },
            { name: 'price', label: 'Price', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
          ]},
        ],
      },
      {
        title: 'Social Links',
        fields: [
          { name: 'social_instagram', label: 'Instagram URL', type: 'url' },
          { name: 'social_facebook', label: 'Facebook URL', type: 'url' },
        ],
      },
    ],
  },
}

export function getFormConfig(categorySlug) {
  return FORM_CONFIGS[categorySlug] || null
}