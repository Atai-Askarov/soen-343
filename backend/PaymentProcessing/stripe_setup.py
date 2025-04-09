import stripe
key = "sk_test_51R2FpKK8U1OF0xnbrxZ08CEyknFRuPgHGGv3cNBj0MuaJFXdAFI6u2qtGnH5BWV6tkhTSvP8CeN3FtNZWuwHZqM200DvnK061p"
stripe.api_key = key
  # Replace with your actual secret key

def create_ticket_product(event_name, event_description, active = True):
    try:
        product = stripe.Product.create(
            name=event_name,
            description=event_description,
            active = active
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
            'active': updated_product.active
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
            'active': archived_product.active
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
    
def create_ticket_price(amount, nickname, product_id):
    prices = {}
    try:
        if amount in prices:
            return prices[amount]
        else:
            price = stripe.Price.create(
                
                unit_amount=amount,
                currency="cad",
                nickname=nickname,
                product = product_id, 
                active = True
            )
            prices[amount] = price.id
            return price.id
    except stripe.error.StripeError as e:
        print(f"An error occurred: {e} + ghvhjbknlm;")
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
    
import stripe
import time
from typing import List, Optional

def delete_stripe_products(
    api_key: str,
    product_ids: Optional[List[str]] = None,
    delete_all: bool = True,
    test_mode_only: bool = False,
    batch_size: int = 100,
    delay: float = 0.2
) -> dict:
    """
    Delete multiple products from Stripe catalog
    
    Args:
        api_key: Stripe secret API key
        product_ids: Specific product IDs to delete (optional)
        delete_all: Delete all products when True (use with caution!)
        test_mode_only: Only affect test mode products
        batch_size: Number of products to process per batch
        delay: Seconds between API calls to avoid rate limits
    
    Returns:
        Dictionary with results and error counts
    """
    stripe.api_key = api_key
    results = {
        'deleted': 0,
        'skipped': 0,
        'errors': 0,
        'failed_ids': []
    }

    try:
        if product_ids:
            # Delete specific products
            products = [stripe.Product.retrieve(pid) for pid in product_ids]
        elif delete_all:
            # List all products with pagination
            products = stripe.Product.list(
                limit=batch_size,
                active=True,
                expand=['data.default_price']
            ).auto_paging_iter()
        else:
            raise ValueError("Must specify either product_ids or delete_all=True")

        for product in products:
            try:
                # Skip live products in test_mode_only operation
                if test_mode_only and product.livemode:
                    results['skipped'] += 1
                    continue

                # Check for active prices
                if product.default_price and stripe.Price.retrieve(
                    product.default_price
                ).active:
                    results['skipped'] += 1
                    continue

                # Archive first (recommended best practice)
                stripe.Product.modify(
                    product.id,
                    active=False
                )
                time.sleep(delay)

                # Then delete
                stripe.Product.delete(product.id)
                results['deleted'] += 1
                time.sleep(delay)

            except stripe.error.StripeError as e:
                results['errors'] += 1
                results['failed_ids'].append(product.id)
                print(f"Error processing {product.id}: {str(e)}")

    except Exception as e:
        print(f"Fatal error: {str(e)}")
        results['errors'] += 1

    return results
