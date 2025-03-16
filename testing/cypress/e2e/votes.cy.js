describe("Votes on questions answers and comments", () => {
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

  it("add a new question and upvote and downvote question", () => {
    // add a question
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();

    // Wait for the new question to be added successfully
    cy.contains("Test Question A").should("be.visible");

    // Go back to main page
    cy.contains("Test Question A").click();

    cy.get("#downvoteButton").click();
    cy.contains("Votes: -1"); // Verify that the vote count has increased

    cy.get("#upvoteButton").click();
    cy.contains("Votes: 1");
  });

  it("to an existing question of another user, add upvote and downvote question", () => {
    // Go back to main page
    cy.contains("Optimizing SQL queries for performance").click();

    cy.get("#downvoteButton").click();
    cy.contains("Votes: 0");

    cy.get("#upvoteButton").click();
    cy.contains("Votes: 2");
  });

  it("add a new answer and upvote and downvote answer", () => {
    // add an answer to question of React Router
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Answer to React Router");
    cy.contains("Post Answer").click();

    // Wait for the new question to be added successfully
    cy.contains("Answer to React Router").should("be.visible");
    cy.get("#downvoteButtonAnswer").click();
    cy.contains("Votes: -1"); // Verify that the vote count has increased

    cy.get("#upvoteButtonAnswer").click();
    cy.contains("Votes: 1");
  });

  it("to an existing question of another user, add upvote and downvote answer", () => {
    // Go back to main page
    cy.contains("Object storage for a web application").click();

    cy.get("#upvoteButtonAnswer").click();
    cy.contains("Votes: 2");

    cy.get("#downvoteButtonAnswer").click();
    cy.contains("Votes: 0");
  });

  it("show question comments and upvote and downvote the comment", () => {
    // Go back to main page
    cy.contains("Deployment strategies for containerized applications").click();

    cy.get("button").contains("Show Comments").click();
    cy.contains("This is a comment").should("be.visible");

    cy.get("#downvoteButtonComment").click();
    cy.contains("Votes: -1");

    cy.get("#upvoteButtonComment").click();
    cy.contains("Votes: 1");
  });
});
