
describe("Tests for answering a question and answer page", () => {

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

    it("1.1 | Created new answer should be displayed at the top of the answers page", () => {
    const answers = [
      "Test Answer 1",
      "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
      "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    ];
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type(answers[0]);
    cy.contains("Post Answer").click();
    cy.get(".answerText").each(($el, index) => {
      cy.contains(answers[index]);
    });
    cy.contains("JohnDoe");
    cy.contains("0 seconds ago");
  });

  it("1.2 | Answer is mandatory when creating a new answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    cy.contains("Post Answer").click();
    cy.contains("Answer text cannot be empty");
  });

  it("1.3 | Adds a question, click active button, verifies the sequence", () => {
    cy.visit("http://localhost:3000");

    // add a question
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();

    // add an answer to question of React Router
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Answer to React Router");
    cy.contains("Post Answer").click();

    // go back to main page
    cy.contains("Questions").click();

    // add an answer to question of Android Studio
    cy.contains(
      "android studio save string shared preference, start activity and load the saved string"
    ).click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Answer to android studio");
    cy.contains("Post Answer").click();

    // go back to main page
    cy.contains("Questions").click();

    // add an answer to question A
    cy.contains("Test Question A").click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type("Answer Question A");
    cy.contains("Post Answer").click();

    // go back to main page
    cy.contains("Questions").click();

    // clicks active
    cy.contains("Active").click();

    const qTitles = [
      "Test Question A",
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
      "Handling state in React components",
      "Quick question about storage on android",
      "Object storage for a web application",
      "Deployment strategies for containerized applications",
      "Implementing RESTful APIs in Node.js",
      "Secure authentication methods for web applications",
      "Optimizing SQL queries for performance",
     
      
      
         
          
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("1.4 | Checks if a6 and a7 exist in q3 answers page", () => {
    const answers = [
      "Storing content as BLOBs in databases.",
    ];
    cy.contains("Object storage for a web application").click();
    cy.get(".answerText").each(($el, index) => {
      cy.contains(answers[index]);
    });
  });


  it("1.5 | Checks if a8 exist in q4 answers page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Quick question about storage on android").click();
    cy.contains("Using GridFS to chunk and store content.");
  });

});
