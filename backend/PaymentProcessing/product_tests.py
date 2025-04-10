import unittest
from unittest.mock import patch, Mock
import stripe
from stripe_setup import create_ticket_price, get_ticket_price, update_ticket_price, archive_ticket_price
from stripe_setup import create_ticket_product, get_ticket_product, update_ticket_product, archive_ticket_product
# Replace with your test API key
stripe.api_key = "sk_test_51R2FpKK8U1OF0xnbrxZ08CEyknFRuPgHGGv3cNBj0MuaJFXdAFI6u2qtGnH5BWV6tkhTSvP8CeN3FtNZWuwHZqM200DvnK061p"

class TestStripeIntegration(unittest.TestCase):

    def setUp(self):
        self.name = "Golfing"
        self.description = "Free range golfing"
        self.active = True
        self.product_id = "product_test123"
    def test_create_ticket_product(self):
        with patch("stripe.Product.create") as mock_product_create:
            mock_response = Mock()
            mock_response.id = "product_test123"
            mock_product_create.return_value = mock_response

            product_id = create_ticket_product(event_name = self.name, event_description= self.description, active = self.active)
            self.assertEqual(product_id, "product_test123")

    def test_get_ticket_product(self):
        with patch("stripe.Product.retrieve") as mock_product_retrieve:
            mock_response = Mock()
            mock_response.id = self.product_id
            mock_response.name = self.name
            mock_response.description = self.description
            mock_response.active = self.active
            mock_product_retrieve.return_value = mock_response

            product_info = get_ticket_product(self.product_id)
            self.assertEqual(product_info["id"], self.product_id)
            self.assertEqual(product_info["name"], self.name)
            self.assertEqual(product_info["description"], self.description)
            self.assertEqual(product_info["active"], self.active)

    def test_update_ticket_product(self):
        with patch("stripe.Product.modify") as mock_product_modify:
            mock_response = Mock()
            mock_response.id = self.product_id
            mock_response.name = "Updated Golfing"
            mock_response.description = "Updated description"
            mock_response.active = False
            mock_product_modify.return_value = mock_response

            updated_product = update_ticket_product(self.product_id, name="Updated Golfing", description="Updated description", active=False)
            self.assertEqual(updated_product["id"], self.product_id)
            self.assertEqual(updated_product["name"], "Updated Golfing")
            self.assertEqual(updated_product["description"], "Updated description")
            self.assertFalse(updated_product["active"])

    def test_archive_ticket_product(self):
        with patch("stripe.Product.modify") as mock_product_modify:
            mock_response = Mock()
            mock_response.id = self.product_id
            mock_response.active = False
            mock_product_modify.return_value = mock_response

            archived_product = archive_ticket_product(self.product_id)
            self.assertEqual(archived_product["id"], self.product_id)
            self.assertFalse(archived_product["active"])

    # 


if __name__ == '__main__':
    unittest.main()