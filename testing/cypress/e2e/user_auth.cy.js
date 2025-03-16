describe("User Authentication Tests", () => {

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.exec("node ../server/init.js");
  });

  afterEach(() => {
    cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
  });

  it("should display the login form", () => {
    // Check if the login form elements are present
    cy.get("form").should("exist");
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
    cy.get("button[type='submit']").should("exist");
  });

  it("login page should display an error message when submitting empty form", () => {
    // Submit the form without entering any credentials
    cy.get("form").submit();

    // Check if the error message is displayed
    cy.contains("Please enter email and password").should("exist");
  });

  it("verify guest login and logout", () => {
    // Submit the form without entering any credentials
    cy.contains("Guest Login").click();
    cy.contains("All Questions").should("exist");
  });


  it("should navigate back to login page when clicking 'Back to Login from signup page'", () => {
    // Click on the "Sign Up" link
    cy.contains("Dont have an account? Sign Up").click();

    // Check if the signup form is visible
    cy.get("form[name='signup-form']").should("be.visible");

    // Click on the "Back to Login" button
    cy.contains("Back to Login").click();

    // Check if the login form is visible
    cy.get("form[name='login-form']").should("be.visible");
  });

  it("login page should display an error message for incorrect credentials", () => {
    // Enter incorrect credentials
    cy.get("#email").type("invalid@example.com");
    cy.get("#password").type("invalidpassword");

    // Submit the form
    cy.get("form").submit();

    // Check if the error message is displayed
    cy.contains("Incorrect email or password").should("exist");
  });

  it("should successfully login with valid data", () => {
    cy.get("#email").type("john.doe@example.com");
    cy.get("#password").type("password1");

    cy.get("form").submit();

    cy.contains("All Questions").should("be.visible");

  });

  it("should redirect to signup page when clicking 'Sign Up'", () => {
    // Click on the "Sign Up" link
    cy.contains("Dont have an account? Sign Up").click();

    // Check if the URL contains "/signup"
    cy.get("form[name='signup-form']").should("be.visible");
  });

  it("signup page should display error messages for empty fields", () => {
    cy.contains("Dont have an account? Sign Up").click();
    cy.get("form[name='signup-form']").submit();

    // Check if error messages are displayed for all mandatory fields
    cy.contains("All fields are mandatory.").should("be.visible");
  });

  it("signup page should display error message for invalid password", () => {
    cy.contains("Dont have an account? Sign Up").click();
    cy.get("input[type='email']").type("test@example.com"); 
    cy.get("input[type='text']").type("testuser"); 
    cy.get("input[type='password']").eq(0).type("weak"); 
    cy.get("input[type='password']").eq(1).type("weak"); 
    cy.get("form[name='signup-form']").submit();
  
    // Check if error message is displayed for invalid password
    cy.contains("Password must be at least 8 characters long").should("be.visible");
  });
  

  it("should successfully sign up with valid data", () => {
    cy.contains("Dont have an account? Sign Up").click();
    cy.get("input[type='email']").type("test@example.com");
    cy.get("input[type='text']").type("testuser");
    cy.get("input[type='password']").eq(0).type("StrongPassword123!");
    cy.get("input[type='password']").eq(1).type("StrongPassword123!");
    cy.get("form[name='signup-form']").submit();

    // Check if the success message is displayed
    cy.contains("Signed up successfully!").should("be.visible");

    // Check if the "Back to Login" button is visible
    cy.contains("Back to Login").should("be.visible");
  });
  it("signup page should display error message for passwords that do not match", () => {
    cy.contains("Dont have an account? Sign Up").click();
    cy.get("input[type='email']").type("test@example.com");
    cy.get("input[type='text']").type("testuser");
    cy.get("input[type='password']").eq(0).type("StrongPassword123!");
    cy.get("input[type='password']").eq(1).type("MismatchedPassword123!");
    cy.get("form[name='signup-form']").submit();

    // Check if error message is displayed for passwords that do not match
    cy.contains("Passwords do not match.").should("be.visible");
});

it("signup page should display error message for invalid email format", () => {
    cy.contains("Dont have an account? Sign Up").click();
    cy.get("input[type='email']").type("invalidemailformat"); // Invalid email format
    cy.get("input[type='text']").type("testuser");
    cy.get("input[type='password']").eq(0).type("StrongPassword123!");
    cy.get("input[type='password']").eq(1).type("StrongPassword123!");
    cy.get("form[name='signup-form']").submit();

    // Check if error message is displayed for invalid email format
    cy.contains("Invalid email format.").should("be.visible");
});

it("signup page should display error message for username with insufficient length", () => {
    cy.contains("Dont have an account? Sign Up").click();
    cy.get("input[type='email']").type("test@example.com");
    cy.get("input[type='text']").type("short"); // Username with insufficient length
    cy.get("input[type='password']").eq(0).type("StrongPassword123!");
    cy.get("input[type='password']").eq(1).type("StrongPassword123!");
    cy.get("form[name='signup-form']").submit();

    // Check if error message is displayed for username with insufficient length
    cy.contains("Username must start with an alphabet and be at least 8 characters long.").should("be.visible");
});

it("signup page should display error message for password with insufficient length", () => {
    cy.contains("Dont have an account? Sign Up").click();
    cy.get("input[type='email']").type("test@example.com");
    cy.get("input[type='text']").type("testuser");
    cy.get("input[type='password']").eq(0).type("weak"); // Password with insufficient length
    cy.get("input[type='password']").eq(1).type("weak");
    cy.get("form[name='signup-form']").submit();

    // Check if error message is displayed for password with insufficient length
    cy.contains("Password must be at least 8 characters long and contain at least one alphabet, one number, and one special character.").should("be.visible");
});

it("signup page should display error message for password with insufficient complexity", () => {
    cy.contains("Dont have an account? Sign Up").click();
    cy.get("input[type='email']").type("test@example.com");
    cy.get("input[type='text']").type("testuser");
    cy.get("input[type='password']").eq(0).type("simplepassword"); // Password with insufficient complexity
    cy.get("input[type='password']").eq(1).type("simplepassword");
    cy.get("form[name='signup-form']").submit();

    // Check if error message is displayed for password with insufficient complexity
    cy.contains("Password must be at least 8 characters long and contain at least one alphabet, one number, and one special character.").should("be.visible");
});

it("should open logout confirmation modal on clicking the logout button", () => {
  cy.get("#email").type("john.doe@example.com");
  cy.get("#password").type("password1");
 
  cy.get("form").submit();
 
  cy.contains("All Questions").should("be.visible");
  cy.contains("Logout").click();
 
 
  cy.get("#logout-modal-title").should("be.visible");
 
  // Click on the logout button inside the modal
  cy.get("#logoutButton").click();
 
  cy.contains("Sign in").should("be.visible");
});

 });


