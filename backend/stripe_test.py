import stripe
stripe.api_key = "sk_test_51R2FpKK8U1OF0xnbrxZ08CEyknFRuPgHGGv3cNBj0MuaJFXdAFI6u2qtGnH5BWV6tkhTSvP8CeN3FtNZWuwHZqM200DvnK061p"
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

def create_ticket_price(amount, nickname, product_id):
    prices = {}
    print(prices)
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
        print(f"An error occurred: {e}")
        return None


# productId = create_ticket_product("lasso throwing","one handed lasso throwing");
# ppID = create_ticket_price(2300, "Concordian", productId)
# print(ppID)