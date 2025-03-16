describe("Tests for question and answer comments", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.exec("node ../server/init.js");
    cy.get("#email").type("john.doe@example.com");
    cy.get("#password").type("password1");
    cy.get("form").submit();
  });

  afterEach(() => {
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  it(" show and hide comments", () => {
    // Go back to main page
    cy.contains("Deployment strategies for containerized applications").click();

    cy.get("button").contains("Show Comments").click();
    cy.contains("This is a comment").should("be.visible");
    cy.get("button").contains("Hide Comments").click();
    cy.contains("Show Comments");
  });

  it(" add a new question, show comments and verify if its present", () => {
    cy.contains("Deployment strategies for containerized applications").click();

    cy.get("#qsCommentTextField").type("This is a new comment");
    cy.get("#qsCommentButton").click();
    cy.contains("This is a new comment").should("be.visible");
  });

  it(" add a new comment to the answer, show comments and verify if its present", () => {
    cy.contains("Deployment strategies for containerized applications").click();

    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Answer to React Router");
    cy.contains("Post Answer").click();
    cy.get("#asCommentTextField").type("This is a comment for the answer");
    cy.get("#asCommentButton").click();
    cy.contains("This is a comment for the answer").should("be.visible");
  });
});
