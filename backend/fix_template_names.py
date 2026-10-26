from database.mongo import get_db

db = get_db()

# Space and Capital letters ah remove panni, lowercase and hyphen format ku maathum
# E.g., "Photography Template 01" -> "photography-01"
mapping = {
    "Medical Template 01": "medical-01",
    "Salon Template 01": "salon-01",
    "Gym Template 01": "gym-01",
    "Photography Template 01": "photography-01",
    "Portfolio Template 01": "portfolio-01",
    "Real Estate Template 01": "real-estate-01",
    "Education Template 01": "education-01"
}

for old_name, new_name in mapping.items():
    result = db.websites.update_many(
        {"template_name": old_name},
        {"$set": {"template_name": new_name}}
    )
    if result.modified_count > 0:
        print(f"✅ Updated {result.modified_count} websites from '{old_name}' to '{new_name}'")

print("🎉 All template names fixed!")
