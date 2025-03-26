import stripe
stripe.api_key = "sk_test_51R2FpKK8U1OF0xnbrxZ08CEyknFRuPgHGGv3cNBj0MuaJFXdAFI6u2qtGnH5BWV6tkhTSvP8CeN3FtNZWuwHZqM200DvnK061p"
  # Replace with your actual secret key

def create_ticket_product(event_name, event_description):
    try:
        product = stripe.Product.create(
            name=event_name,
            description=event_description, 
        )
        return product.id
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None

# Read
def get_ticket_product(product_id):
    try:
        product = stripe.Product.retrieve(product_id)
        return {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'active': product.active,
            'metadata': product.metadata
        }
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None

# Update
def update_ticket_product(product_id, **kwargs):
    try:
        updated_product = stripe.Product.modify(
            product_id,
            **kwargs
        )
        return {
            'id': updated_product.id,
            'name': updated_product.name,
            'description': updated_product.description,
            'active': updated_product.active,
            'metadata': updated_product.metadata
        }
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None

# Delete (Archive)
def archive_ticket_product(product_id):
    try:
        archived_product = stripe.Product.modify(
            product_id,
            active=False
        )
        return {
            'id': archived_product.id,
            'name': archived_product.name,
            'description': archived_product.description,
            'active': archived_product.active,
            'metadata': archived_product.metadata
        }
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None

# Usage example

#nicknames:
    #Concordian, student, regular
    #Concordian has a big discount
    #student has a moderate discount
    #regular has no discount
    
def create_ticket_price(product_id, amount, nickname, lookup_key, tax_behavior='exclusive'):
    try:
        price = stripe.Price.create(
            product=product_id,
            unit_amount=amount,
            currency="cad",
            nickname=nickname,
            lookup_key=lookup_key,
            tax_behavior=tax_behavior
        )
        return price.id
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None
    
def get_ticket_price(price_id):
    try:
        price = stripe.Price.retrieve(price_id)
        return {
            'id': price.id,
            'product_id': price.product,
            'unit_amount': price.unit_amount,
            'currency': price.currency,
            'nickname': price.nickname,
            'lookup_key': price.lookup_key,
            'tax_behavior': price.tax_behavior
        }
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None


def archive_ticket_price(price_id):
    try:
        archived_price = stripe.Price.modify(
            price_id,
            active=False
        )
        return {
            'id': archived_price.id,
            'product_id': archived_price.product,
            'unit_amount': archived_price.unit_amount,
            'currency': archived_price.currency,
            'nickname': archived_price.nickname,
            'lookup_key': archived_price.lookup_key,
            'tax_behavior': archived_price.tax_behavior,
            'active': archived_price.active
        }
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None
    
def update_ticket_price(price_id, **kwargs):
    try:
        updated_price = stripe.Price.modify(
            price_id,
            **kwargs
        )
        return {
            'id': updated_price.id,
            'product': updated_price.product,
            'unit_amount': updated_price.unit_amount,
            'currency': updated_price.currency,
            'nickname': updated_price.nickname,
            'lookup_key': updated_price.lookup_key,
            'tax_behavior': updated_price.tax_behavior,
            'active': updated_price.active,
            'metadata': updated_price.metadata
        }
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e}")
        return None
    
price = create_ticket_product("Rock Climbing", "Outdoors rock climbing", )
price_object = get_ticket_product(price)
deleted_price_object = archive_ticket_product(price)
print(deleted_price_object)
