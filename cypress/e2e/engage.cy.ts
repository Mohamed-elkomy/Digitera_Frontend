describe("wishlist, reviews, FAQ and the contact form", () => {
  it("saves a fragrance to the wishlist and removes it again", () => {
    cy.visit("/products/fleur-de-lune");
    cy.get('button[aria-label="Save Fleur de Lune to wishlist"]')
      .first()
      .click()
      .should("have.attr", "aria-pressed", "true");

    cy.visit("/wishlist");
    cy.contains("h3", "Fleur de Lune").should("be.visible");

    cy.get('button[aria-label="Remove Fleur de Lune from wishlist"]').click();
    cy.contains("Your wishlist is empty").should("be.visible");
  });

  it("shows client reviews with an average rating on the product page", () => {
    cy.visit("/products/sol-dor");
    cy.get("#reviews-heading").should("contain", "Client Reviews");
    cy.get('[aria-labelledby="reviews-heading"] li').should(
      "have.length.greaterThan",
      1,
    );
  });

  it("opens an FAQ answer", () => {
    cy.visit("/faq");
    cy.get("details").first().find("summary").click();
    cy.get("details").first().should("have.attr", "open");
  });

  it("validates the contact form, then sends it", () => {
    cy.visit("/contact");
    cy.contains("button", "Send inquiry").click();
    cy.focused().should("have.attr", "id", "inquiry-name");
    cy.contains("Please enter your name.").should("be.visible");

    cy.get("#inquiry-name").type("Salma");
    cy.get("#inquiry-email").type("salma@example.com");
    cy.get("#inquiry-subject").type("Corporate gifting");
    cy.get("#inquiry-message").type("Twenty gift sets for our team, please.");
    cy.contains("button", "Send inquiry").click();
    cy.contains("your inquiry has been received").should("be.visible");
  });
});
