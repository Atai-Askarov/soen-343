import { render, screen } from "@testing-library/react";
import App from "../frontend/sees-react/src/App";

test("renders learn react link and logo image", () => {
  render(<App />);

  // Check if the 'Learn React' link is present
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();

  // Check if the logo image is in the document
  const logoElement = screen.getByAltText(/logo/i); // alt text is 'logo' in the App.js file
  expect(logoElement).toBeInTheDocument();
});
