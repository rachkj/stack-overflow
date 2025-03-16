describe("Tag Posts", () => {

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

it("1.1 | Adds a question with tags, checks the tags existied", () => {

    // add a question with tags
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("test1 test2 test3");
    cy.contains("Post Question").click();

    // clicks tags
    cy.contains("Tags").click();
    cy.contains("test1");
    cy.contains("test2");
    cy.contains("test3");
  });

  it("1.2 | Checks if all tags exist", () => {
    // all tags exist in the page
    cy.contains("Tags").click();
    cy.contains("react", { matchCase: false });
    cy.contains("javascript", { matchCase: false });
    cy.contains("android-studio", { matchCase: false });
    cy.contains("shared-preferences", { matchCase: false });
    cy.contains("storage", { matchCase: false });
    cy.contains("website", { matchCase: false });
    cy.contains("node-js", { matchCase: false });
    cy.contains("sql", { matchCase: false });
    cy.contains("authentication", { matchCase: false });
    cy.contains("deployment", { matchCase: false });
    cy.contains("containerization", { matchCase: false });
    cy.contains("api-design", { matchCase: false });
    cy.contains("data-structures", { matchCase: false });
    cy.contains("algorithms", { matchCase: false });
    cy.contains("machine-learning", { matchCase: false });
    

  });

  it("1.3 | Checks if all questions exist inside tags", () => {
    cy.visit("http://localhost:3000");
    // all question no. should be in the page
    cy.contains("Tags").click();
    cy.contains("20 Tags");
    cy.contains("1 question");
    cy.contains("2 question");
    cy.contains("3 question");
    cy.contains("0 question");
  });

  it("1.4 | go to question in tag react", () => {
    cy.visit("http://localhost:3000");
    // all question no. should be in the page
    cy.contains("Tags").click();
    cy.contains("react").click();
    cy.contains("Programmatically navigate using React router");
    cy.contains("Handling state in React components");
  });

  it("1.5 | go to questions in tag deployment", () => {
    cy.visit("http://localhost:3000");
    // all question no. should be in the page
    cy.contains("Tags").click();
    cy.contains("deployment").click();
    cy.contains("Secure authentication methods for web applications");
  });

  it("1.6 | create a new question with a new tag and finds the question through tag", () => {
    cy.visit("http://localhost:3000");

    // add a question with tags
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("test1-tag1");
    cy.contains("Post Question").click();

    // clicks tags
    cy.contains("Tags").click();
    cy.contains("test1-tag1").click();
    cy.contains("Test Question A");
  });

  it("1.7 | Clicks on a tag and verifies the tag is displayed", () => {
    const tagNames = "javascript";

    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();

    cy.contains(tagNames).click();
    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });

  it("1.8 | Clicks on a tag in homepage and verifies the questions related tag is displayed", () => {
    const tagNames = "storage";

    cy.visit("http://localhost:3000");

    //clicks the 3rd tag associated with the question.
    cy.get(".question_tag_button").eq(2).click();

    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });

  it("1.9 | Searches for tags and verifies the displayed tags match the search query", () => {
    const searchText = "containerization";

    cy.contains("Tags").click();
  
    // Type the search text in the search bar
    cy.get("#searchBar").type(searchText);
  
    cy.contains("A JavaScript library for building user interfaces").should("be.visible");
});
});