import os
from jinja2 import Environment, FileSystemLoader

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

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
        
    clean_name = template_name.lower().replace(" template ", "-").replace(" ", "-")
    template_path = f"{clean_name}/dist/index.html"
    
    try:
        template = env.get_template(template_path)
    except Exception as e:
        return f"<h1>Template Error: {e}</h1>"

    # ✅ 2. Ippo namma fix_paths function ah use panni ellam paths ah correct aakkrom
    fixed_data = fix_paths(form_data, cloudfront_base)

    # Images list ah thaniya edukkurom (template la loop panna)
    images = fixed_data.get("images", [])
    
    # ✅ 3. Ippo correct aana data ah template ku anuppurom
    html_output = template.render(
        **fixed_data,
        form_data=fixed_data, 
        images=images,
        uploads_base=cloudfront_base,
        template_slug=clean_name
    )
    return html_output
