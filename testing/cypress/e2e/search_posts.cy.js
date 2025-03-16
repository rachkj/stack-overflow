describe("Search posts", () => {

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

    it("1.1 | Search for a question using text content that does not exist", () => {
        const searchText = "Web3";
        cy.get("#searchBar").type(`${searchText}{enter}`);
        cy.get(".postTitle").should("have.length", 0);
      });
    
      it("1.2 | Search string in question text", () => {
        const qTitles = ["Object storage for a web application"];
        cy.get("#searchBar").type("40 million{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("1.3 | earch string in question text", () => {
        const qTitles = ["Quick question about storage on android"];
        cy.get("#searchBar").type("remains{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("1.4 | Search a question by tag (t1)", () => {
        const qTitles = ["Handling state in React components","Programmatically navigate using React router"];
        cy.get("#searchBar").type("[react]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("1.5 | Search a question by tag (t2)", () => {
        const qTitles = [
          "android studio save string shared preference, start activity and load the saved string",
          "Optimizing SQL queries for performance",
          "Programmatically navigate using React router",
        ];
        cy.get("#searchBar").type("[javascript]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("1.6 | Search a question by tag (t3)", () => {
        const qTitles = [
          "android studio save string shared preference, start activity and load the saved string",
          "Deployment strategies for containerized applications",
        ];
        cy.get("#searchBar").type("[android-studio]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("1.7 | Search a question by tag (t4)", () => {
        const qTitles = [
          "android studio save string shared preference, start activity and load the saved string",
          "Deployment strategies for containerized applications",
        ];
        cy.get("#searchBar").type("[shared-preferences]{enter}");
        cy.get(".postTitle").each(($el, index, $list) => {
          cy.wrap($el).should("contain", qTitles[index]);
        });
      });
    
      it("1.8 | Search for a question using a tag that does not exist", () => {
        cy.get("#searchBar").type("[nonExistentTag]{enter}");
        cy.get(".postTitle").should("have.length", 0);
      });

    });