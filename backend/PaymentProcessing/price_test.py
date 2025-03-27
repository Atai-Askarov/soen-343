import unittest
from unittest.mock import patch, Mock
from stripe_setup import create_ticket_price, get_ticket_price, update_ticket_price, archive_ticket_price


class TestTicketPriceCRUD(unittest.TestCase):
    def setUp(self):
        # Mock data for testing
        self.price_id = "price_test123"
        self.product_id = "prod_test123"
        self.unit_amount = 2000
        self.nickname = "Test Ticket"
        self.currency = "cad"

    def test_create_ticket_price(self):
        # Unit test for creating a ticket price
        with patch("stripe.Price.create") as mock_create:
            mock_response = Mock()
            mock_response.id = self.price_id
            mock_create.return_value = mock_response

            price_id = create_ticket_price(
                amount=self.unit_amount,
                nickname=self.nickname,
                product_id=self.product_id
            )
            self.assertIsNotNone(price_id)
            self.assertEqual(price_id, self.price_id)
            mock_create.assert_called_once_with(
                unit_amount=self.unit_amount,
                currency="cad",
                nickname=self.nickname,
                product=self.product_id,
                active=True
            )

    def test_get_ticket_price(self):
        # Unit test for retrieving a ticket price
        with patch("stripe.Price.retrieve") as mock_retrieve:
            mock_response = Mock()
            mock_response.id = self.price_id
            mock_response.product = self.product_id
            mock_response.unit_amount = self.unit_amount
            mock_response.currency = self.currency
            mock_response.nickname = self.nickname
            mock_retrieve.return_value = mock_response

            price_info = get_ticket_price(self.price_id)
            self.assertIsNotNone(price_info)
            self.assertEqual(price_info["id"], self.price_id)
            self.assertEqual(price_info["product_id"], self.product_id)
            self.assertEqual(price_info["unit_amount"], self.unit_amount)
            self.assertEqual(price_info["currency"], self.currency)
            self.assertEqual(price_info["nickname"], self.nickname)
            mock_retrieve.assert_called_once_with(self.price_id)

    def test_update_ticket_price(self):
        # Unit test for updating a ticket price
        with patch("stripe.Price.modify") as mock_modify:
            mock_response = Mock()
            mock_response.id = self.price_id
            mock_response.nickname = "Updated Test Ticket"
            mock_modify.return_value = mock_response

            updated_price = update_ticket_price(self.price_id, nickname="Updated Test Ticket")
            self.assertIsNotNone(updated_price)
            self.assertEqual(updated_price["id"], self.price_id)
            self.assertEqual(updated_price["nickname"], "Updated Test Ticket")
            mock_modify.assert_called_once_with(self.price_id, nickname="Updated Test Ticket")

    def test_archive_ticket_price(self):
        # Unit test for archiving a ticket price
        with patch("stripe.Price.modify") as mock_modify:
            mock_response = Mock()
            mock_response.id = self.price_id
            mock_response.active = False
            mock_modify.return_value = mock_response

            archived_price = archive_ticket_price(self.price_id)
            self.assertIsNotNone(archived_price)
            self.assertEqual(archived_price["id"], self.price_id)
            self.assertFalse(archived_price["active"])
            mock_modify.assert_called_once_with(self.price_id, active=False)


if __name__ == "__main__":
    unittest.main()