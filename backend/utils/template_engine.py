import os
import json
import re
from jinja2 import Environment, FileSystemLoader, Template

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

DEFAULT_HTML_TEMPLATE = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="{{ uploads_base }}/templates/{{ template_slug }}/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ title }}</title>
    <link rel="stylesheet" crossorigin href="{{ uploads_base }}/templates/{{ template_slug }}/assets/index.css">
  </head>
  <body>
    <div id="root"></div>
    <script>
      window.__SITE_DATA__ = {{ form_data | tojson | safe }};
      window.__UPLOADS_BASE__ = "{{ uploads_base }}";
    </script>
    <script type="module" crossorigin src="{{ uploads_base }}/templates/{{ template_slug }}/assets/index.js"></script>
  </body>
</html>"""

def normalize_template_name(template_name):
    """
    Standardizes any template name string into one of the 7 valid slug folders:
    medical-01, salon-01, gym-01, photography-01, portfolio-01, real-estate-01, education-01
    """
    if not template_name:
        return "portfolio-01"
    name = str(template_name).lower().strip()
    if "gym" in name:
        return "gym-01"
    elif "medical" in name:
        return "medical-01"
    elif "salon" in name or "spa" in name:
        return "salon-01"
    elif "photography" in name or "photo" in name:
        return "photography-01"
    elif "real" in name or "estate" in name:
        return "real-estate-01"
    elif "education" in name or "edu" in name:
        return "education-01"
    elif "portfolio" in name:
        return "portfolio-01"
    else:
        return name.replace(" template ", "-").replace(" ", "-")

# ✅ 1. Ithu dhaan pudhu function (Image paths ah automatic ah fix pannum)
def fix_paths(data, cloudfront_url):
    if isinstance(data, dict):
        return {k: fix_paths(v, cloudfront_url) for k, v in data.items()}
    elif isinstance(data, list):
        return [fix_paths(i, cloudfront_url) for i in data]
    elif isinstance(data, str):
        # Full URL ah irundha, adha appadiye vidurom
        if data.startswith("http"):
            return data
        # /uploads/ la aarambikkura path ah CloudFront URL ku maathurom
        elif data.startswith("/uploads/"):
            return f"{cloudfront_url}{data}"
        # Vera edhavadhu relative path ah irundha (/assets/ etc.), adhayum maathurom
        elif data.startswith("/") and not data.startswith("//"):
            return f"{cloudfront_url}{data}"
        # ✅ 3. Just filename (e.g., image.jpg) ah irundha, uploads/ sethurom
        elif "." in data and not data.startswith("/") and len(data) < 100:
            if data.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif')):
                return f"{cloudfront_url}/uploads/{data}"
    return data

def render_template(template_name, form_data, cloudfront_base):
    # ✅ Form data empty ah irundhalum handle pannum
    if not form_data:
        form_data = {}
        
    clean_name = normalize_template_name(template_name)
    template_path = f"{clean_name}/dist/index.html"
    
    # ✅ 2. Ippo namma fix_paths function ah use panni ellam paths ah correct aakkrom
    fixed_data = fix_paths(form_data, cloudfront_base)

    # Images list ah thaniya edukkurom (template la loop panna)
    images = fixed_data.get("images", [])
    title = (
        fixed_data.get("clinic_name")
        or fixed_data.get("company_name")
        or fixed_data.get("salon_name")
        or fixed_data.get("photographer_name")
        or fixed_data.get("full_name")
        or "Website"
    )

    new_site_data_json = json.dumps(fixed_data)
    site_data_pattern = r'window\.__SITE_DATA__\s*=\s*\{.*?\};'

    try:
        template = env.get_template(template_path)
        html_output = template.render(
            **fixed_data,
            form_data=fixed_data, 
            images=images,
            uploads_base=cloudfront_base,
            template_slug=clean_name,
            title=title
        )
        if "window.__SITE_DATA__" in html_output:
            # Overwrite any hardcoded or previously baked SITE_DATA in the template file
            html_output = re.sub(site_data_pattern, f'window.__SITE_DATA__ = {new_site_data_json};', html_output, flags=re.DOTALL)
        else:
            data_script = f'<script>window.__SITE_DATA__ = {new_site_data_json}; window.__UPLOADS_BASE__ = "{cloudfront_base}";</script>'
            html_output = html_output.replace("</body>", f"{data_script}</body>")
        return html_output
    except Exception as e:
        # Fallback to universal template with CloudFront assets
        fallback = Template(DEFAULT_HTML_TEMPLATE)
        return fallback.render(
            **fixed_data,
            form_data=fixed_data,
            images=images,
            uploads_base=cloudfront_base,
            template_slug=clean_name,
            title=title
        )
