describe("Moderate posts Tests", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000");
      cy.exec("node ../server/init.js");
      cy.get("#email").type("admin@gmail.com");
      cy.get("#password").type("1234");
      cy.get("form").submit();
    });
  
    afterEach(() => {
      cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    });
  
    it('1.1 | Moderator can see the questions, ask questions, and order questions', () => {
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
  
    it('1.1 | Moderator can delete any question', () => {
      cy.contains("Programmatically navigate using React router").click();
      cy.contains("Delete Question").click();
  
      cy.contains("Programmatically navigate using React router").should("not.exist");
    });
  
    it('1.2 | Moderator can delete any answer', () => {
      cy.contains("Handling state in React components").click();
      cy.contains("Delete Answer").click();
  
      cy.contains("Store data in a SQLLite database.").should("not.exist");
    });
  
    // it('1.3 | Moderator can delete tags', () => {
    //     cy.contains("Tags").click();
    //     cy.contains('react').parent().find('Button[color="error"]').click();
  
    //     // Assert that the tag is deleted by checking that it is not visible anymore
    //     cy.contains('react').should('not.exist');
    // });
  });
  