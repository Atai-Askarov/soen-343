import stripe
stripe.api_key = "sk_test_51R2FpKK8U1OF0xnbrxZ08CEyknFRuPgHGGv3cNBj0MuaJFXdAFI6u2qtGnH5BWV6tkhTSvP8CeN3FtNZWuwHZqM200DvnK061p"

def create_promotion_package_product(width, length, active, name, description):
    try:    
        product = stripe.Product.create(
            name=name,
            description=description,
            package_dimensions={"width": width, "length": length, "height": 0, "weight": 0},
            active=active
        )
        return product.id
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None

def update_promotion_package_product(product_id, **kwargs):
    try:
        updated_product = stripe.Product.modify(product_id, **kwargs)
        return {
            "id": updated_product.id,
            "name": updated_product.name,
            "description": updated_product.description,
            "width": updated_product.package_dimensions["width"],
            "length": updated_product.package_dimensions["length"],
            "active": updated_product.active,
            "metadata": updated_product.metadata
        }
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None

def archive_promotion_package_product(product_id):
    try:
        archived_product = stripe.Product.modify(product_id, active=False)
        return {
            "id": archived_product.id,
            "name": archived_product.name,
            "description": archived_product.description,
            "width": archived_product.package_dimensions["width"],
            "length": archived_product.package_dimensions["length"],
            "active": archived_product.active,
            "metadata": archived_product.metadata
        } 
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None

def get_promotion_package_product(product_id):
    try:
        product = stripe.Product.retrieve(product_id)
        return {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "width": product.package_dimensions["width"],
            "length": product.package_dimensions["length"],
            "active": product.active,
            "metadata": product.metadata
        }
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None

# Example usage
product_id = create_promotion_package_product(5, 6, True, 'Premium Package', "Packages for premium users")
print(f"Created Product ID: {product_id}")

product = archive_promotion_package_product(product_id)
#print(f"Archived Product: {product}")

product1 = update_promotion_package_product(product_id, active = True)
print(product1)