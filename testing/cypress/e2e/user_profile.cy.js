describe("User Profiles Tests", () => {

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

  it("renders user details, questions, and answers on clicking the profile page", () => {
    cy.contains("Profile").click();
    // Verify user details are displayed
    cy.contains("JohnDoe");
    cy.contains("john.doe@example.com");

    // Verify questions posted by the user are displayed
    cy.contains("Questions Posted");
    cy.contains("No questions posted by the user");

    // Verify answers provided by the user are displayed
    cy.contains("Answers");
    cy.contains("React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.");
  });

  it("opens edit profile form when 'Edit Profile' button is clicked", () => {
    cy.contains("Profile").click();
    // Click the "Edit Profile" button
    cy.contains("Edit Profile").click();

    // Verify that the edit profile form is displayed
    cy.contains("Update Profile");
    cy.contains("Name");
    cy.contains("Old Password");
  });

  it("opens update password form when 'Update Password' button is clicked", () => {
    cy.contains("Profile").click();
    // Click the "Update Password" button
    cy.contains("Update Password").click();

    // Verify that the update password form is displayed
    cy.contains("Old Password");
    cy.contains("New Password");
    cy.contains("Confirm New Password");
    cy.contains("Update Profile");
  });

  it("add a new question, go to profile page, redirects to question page when clicking questions", () => {
    // add a question
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();

    // Wait for the new question to be added successfully
    cy.contains("Test Question A").should("be.visible");

    cy.contains("Profile").click();
    // Click a question
    cy.contains("Test Question A").click();

    // Verify that the user is redirected to the question page
    cy.contains("Test Question A");
    cy.contains("0 answers");
  });

  it("updates name when 'Update Profile' button is clicked", () => {
    // Visit the profile page
    cy.contains("Profile").click();

    // Click the "Edit Profile" button
    cy.contains("Edit Profile").click();

    // Verify that the edit profile form is displayed
    cy.contains("Update Profile");
    cy.contains("Name");
    cy.contains("Old Password");

    // Enter the new name
    const newName = "JohnDoes";
    cy.get('#uname').clear();
    cy.get('#uname').type(newName);

    // Enter the old password
    const oldPassword = "password1";
    cy.get('input[type="password"]').type(oldPassword);

    // Click the "Update Profile" button
    cy.get('#updateProfileButton').click();

    // Verify that the email is updated successfully
    cy.contains("Updated profile successfully!");

    // Click the "Back to Profile Page" button
    cy.contains("Back to Profile Page").click();

    // Verify that the updated name is displayed
    cy.contains(newName);
});

  it("search bar should exist and display user search results", () => {
    cy.contains("Users").click();
    cy.get(".searchBarUser").should("exist");

    // Type a search query and verify if it exists
    cy.get(".searchBarUser").type("AliceSmith");

    // Click on the searched user
    cy.contains("AliceSmith").should("be.visible");
    cy.contains("Regular").should("be.visible");

    cy.contains("AliceSmith").click();
    cy.contains("No questions posted by the user").should("be.visible");
  });
});
