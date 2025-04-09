import stripe
stripe.api_key = "sk_test_51R2FpKK8U1OF0xnbrxZ08CEyknFRuPgHGGv3cNBj0MuaJFXdAFI6u2qtGnH5BWV6tkhTSvP8CeN3FtNZWuwHZqM200DvnK061p"

def create_promotion_package_product(width, height, name, event_id, active = True):
    try:    
        product = stripe.Product.create(
            name=name,
            package_dimensions={"width": width, "height": height, "length": 0, "weight": 0},
            active=active,
            metadata={"event_id": event_id}
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
            "width": updated_product.package_dimensions["width"],
            "height": updated_product.package_dimensions["height"],
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
            "width": archived_product.package_dimensions["width"],
            "height": archived_product.package_dimensions["height"],
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
            "width": product.package_dimensions["width"],
            "height": product.package_dimensions["height"],
            "active": product.active,
            "metadata": product.metadata
        }
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None
