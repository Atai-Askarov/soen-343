import unittest
from unittest.mock import patch, Mock
import stripe
from stripe_setup import create_ticket_price, get_ticket_price, update_ticket_price, archive_ticket_price

# Replace with your test API key
stripe.api_key = "sk_test_51R2FpKK8U1OF0xnbrxZ08CEyknFRuPgHGGv3cNBj0MuaJFXdAFI6u2qtGnH5BWV6tkhTSvP8CeN3FtNZWuwHZqM200DvnK061p"

class TestStripeIntegration(unittest.TestCase):

    def setUp(self):
        self.product_id = "prod_test123"  # Replace with a valid product ID in your Stripe test environment
        self.price_id = None

    def test_create_ticket_price(self):
        # Unit test with mock
        with patch('stripe.Price.create') as mock_create:
            mock_response = Mock()
            mock_response.id = 'price_test123'
            mock_create.return_value = mock_response

            price_id = create_ticket_price(self.product_id, 2000, "Test Ticket", "test_ticket_2023")
            self.assertEqual(price_id, 'price_test123')

        # Integration test
        price_id = create_ticket_price(self.product_id, 2000, "Test Ticket", "test_ticket_2023")
        self.assertIsNotNone(price_id)
        self.price_id = price_id  # Save for later tests

    def test_get_ticket_price(self):
        # Unit test with mock
        with patch('stripe.Price.retrieve') as mock_retrieve:
            mock_response = Mock()
            mock_response.id = 'price_test123'
            mock_response.product = self.product_id
            mock_response.unit_amount = 2000
            mock_response.currency = 'cad'
            mock_response.nickname = "Test Ticket"
            mock_response.lookup_key = "test_ticket_2023"
            mock_response.tax_behavior = 'exclusive'
            mock_response.active = True
            mock_retrieve.return_value = mock_response

            price_info = get_ticket_price('price_test123')
            self.assertEqual(price_info['nickname'], "Test Ticket")

        # Integration test
        if self.price_id:
            price_info = get_ticket_price(self.price_id)
            self.assertEqual(price_info['unit_amount'], 2000)

    def test_update_ticket_price(self):
        # Unit test with mock
        with patch('stripe.Price.modify') as mock_modify:
            mock_response = Mock()
            mock_response.id = 'price_test123'
            mock_response.nickname = "Updated Test Ticket"
            mock_response.active = True
            mock_modify.return_value = mock_response

            updated_price = update_ticket_price('price_test123', nickname="Updated Test Ticket")
            self.assertEqual(updated_price['nickname'], "Updated Test Ticket")

        # Integration test
        if self.price_id:
            updated_price = update_ticket_price(self.price_id, nickname="Updated Test Ticket")
            self.assertEqual(updated_price['nickname'], "Updated Test Ticket")

    def test_archive_ticket_price(self):
        # Unit test with mock
        with patch('stripe.Price.modify') as mock_modify:
            mock_response = Mock()
            mock_response.id = 'price_test123'
            mock_response.active = False
            mock_modify.return_value = mock_response

            archived_price = archive_ticket_price('price_test123')
            self.assertFalse(archived_price['active'])

        # Integration test
        if self.price_id:
            archived_price = archive_ticket_price(self.price_id)
            self.assertFalse(archived_price['active'])


if __name__ == '__main__':
    unittest.main()