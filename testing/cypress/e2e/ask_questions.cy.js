describe("Tests for New Question, Questions Page", () => {

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

  it('1.1 | Login and add a question then click "Questions", then click unanswered button, verifies the sequence', () => {
    // add a question
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();

    // Wait for the new question to be added successfully
    cy.contains("Test Question A").should("be.visible");

    // Go back to main page
    cy.contains("All Questions").click();

    // Clicks unanswered
    cy.contains("Unanswered").click();

    // Check if the newly added question is present in the unanswered questions list
    cy.contains("Test Question A").should("be.visible");
  });

  it("1.2 | Check if questions are displayed in descending order of dates.", () => {
    const qTitles = [
      "Quick question about storage on android",
      "Object storage for a web application",
      "android studio save string shared preference, start activity and load the saved string",
      "Deployment strategies for containerized applications",
      "Implementing RESTful APIs in Node.js",
      "Secure authentication methods for web applications",
      "Optimizing SQL queries for performance",
      "Handling state in React components",
      "Programmatically navigate using React router",
    ];

    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("1.3 | successfully shows all questions in model in active order", () => {
    const qTitles = [
      "Programmatically navigate using React router",
      "android studio save string shared preference, start activity and load the saved string",
      "Handling state in React components",
      "Quick question about storage on android",
      "Object storage for a web application",
      "Deployment strategies for containerized applications",
      "Implementing RESTful APIs in Node.js",
      "Secure authentication methods for web applications",
      "Optimizing SQL queries for performance",
    ];

    cy.contains("Active").click();
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("1.4 | Adds multiple questions one by one and displays them in All Questions", () => {
    cy.visit("http://localhost:3000");

    // Add multiple questions
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();

    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 2");
    cy.get("#formTextInput").type("Test Question 2 Text");
    cy.get("#formTagInput").type("react");
    cy.contains("Post Question").click();

    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 3");
    cy.get("#formTextInput").type("Test Question 3 Text");
    cy.get("#formTagInput").type("java");
    cy.contains("Post Question").click();

    // verify that when clicking "Unanswered", the unanswered questions are shown
    cy.contains("Unanswered").click();
    const qTitlesUnanswered = [
      "Test Question 3",
      "Test Question 2",
      "Test Question 1",
      "Deployment strategies for containerized applications",
      "Implementing RESTful APIs in Node.js",
      "Secure authentication methods for web applications",
      "Optimizing SQL queries for performance",
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitlesUnanswered[index]);
    });
  });

  it("1.5 | Ask a Question creates and displays expected meta data", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question Q1");
    cy.get("#formTextInput").type("Test Question Q1 Text T1");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();
    cy.contains("Fake Stack Overflow");
    cy.contains("10 questions");
    cy.contains("JohnDoe asked ");
    const answers = [
      "0 answers",
      "1 answers",
      "1 answers",
      "3 answers",
      "0 answers",
      "0 answers",
      "0 answers",
      "0 answers",
      "1 answers",
      "2 answers",
    ];
    const views = [
      "0 views",
      "51 views",
      "100 views",
      "60 views",
      "39 views",
      "32 views",
      "13 views",
      "22 views",
      "7 views",
      "5 views",
    ];
    cy.get(".postStats").each(($el, index, $list) => {
      cy.wrap($el).should("contain", answers[index]);
      cy.wrap($el).should("contain", views[index]);
    });
    cy.contains("Unanswered").click();
    cy.get(".postTitle").should("have.length", 5);
    cy.contains("5 questions");
  });

  it("1.6 | Ask a Question with empty title shows error", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTextInput").type("Test Question 1 Text Q1");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();
    cy.contains("Title cannot be empty");
  });

  it("1.7 | Displays an error message when the title exceeds 100 characters", () => {
    const longTitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.";
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type(longTitle);
    cy.get("#formTextInput").type("This is a test question with a long title");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();
    cy.contains("Title cannot be more than 100 characters").should("be.visible");
  });

  it('1.8 | User can delete an answer posted by him', () => {
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Delete Answer").click();

    cy.contains("Programmatically navigate using React router").click();
    cy.contains("React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.").should("not.exist");
  });

  it("1.9 | Displays an error message when the question text is empty", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question with Empty Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();
    cy.contains("Question text cannot be empty").should("be.visible");
  });

  it("2.0 | Displays an error message when there are no tags", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question with No Tags");
    cy.get("#formTextInput").type("This is a test question with no tags");
    cy.contains("Post Question").click();
    cy.contains("Should have at least 1 tag").should("be.visible");
  });

  it("2.1 | Displays an error message when there are more than 5 tags", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question with Too Many Tags");
    cy.get("#formTextInput").type("This is a test question with too many tags");
    cy.get("#formTagInput").type("javascript react nodejs python angular vuejs");
    cy.contains("Post Question").click();
    cy.contains("Cannot have more than 5 tags").should("be.visible");
  });

  it("2.2 | Displays an error message when a tag exceeds 20 characters", () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question with Long Tag");
    cy.get("#formTextInput").type("This is a test question with a long tag");
    cy.get("#formTagInput").type("longtagthatismorethantwentycharacters");
    cy.contains("Post Question").click();
    cy.contains("New tag length cannot be more than 20").should("be.visible");
  });

  it('2.3| User can delete a question posted by him', () => {
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();

    // add an answer to question of React Router
    cy.contains("Test Question 1").click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Answer to Question 1");
    cy.contains("Post Answer").click();

    cy.contains("Test Question 1").click();
    cy.contains("Delete Question").click();

    cy.contains("Test Question 1").should("not.exist");
  });

});
