[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/tekr69j1)
# Final Project CS5610

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EVgJQzqalH9LlZQtMVDxz5kB7eZv2nBwIKFDFYxDMzgohg?e=EPjgIF).


## Instructions for running the program on docker.
1. got to [config](./server/config.js)
2. uncomment lines 5-7.
3. comment lines 9-11.
4. Start your local docker deamon.

5. Open new terminal.
6. docker-compose up --build.

open [client application](http://localhost:3000/).  <br />
Admin Login Credentials for the application: {email: admin@gmail.com, password: 1234}

## Instructions for running the program locally.

1. got to [config](./server/config.js)
2. uncomment lines 9-11.
3. comment lines 5-7.


1. Open the terminal
2. cd server
3. npm install
5. node init.js
4. nodemon server.js

1. Open new terminal
2. cd client
3. npm install
4. npm start

open [client application](http://localhost:3000/). <br />
Admin Login Credentials for the application: {email: admin@gmail.com, password: 1234}


## List of features provided:

1) Ask questions :- Admins and users who have logged in are allowed to post a question. Admins, guest users and regular users can view the question page and the answers associated with each question. [ask-questions](./testing/cypress/e2e/ask_questions.cy.js)
2) Provide answers :- Admins and users are allowed to answer questions.[provide-answers](./testing/cypress/e2e/provide_answers.cy.js)
3) Search for posts :- Users are allowed to search for posts based on username, keyword in the post or tags associated with posts. [search-posts](./testing/cypress/e2e/search_posts.cy.js)
4) Tag posts :- Users can tag the post with the appropriate tags based on the question. [tag-posts](./testing/cypress/e2e/tag_posts.cy.js)
5) Comment on questions and answers :- Users can comment on questions and answers. [comments](./testing/cypress/e2e/comments.cy.js)
6) Create individual user profiles :- Users have individual profile set up, which can be accessed on the Profile page. [user-profiles](./testing/cypress/e2e/user_profile.cy.js)
7) Vote on questions, answers, and comments :- Users can upvote and downvote on questions, answers and comments. [votes](./testing/cypress/e2e/votes.cy.js)
8) Authenticate registered users :- The application provides signup and login forms, and auntenticates each user. Guest users get direct login, but are restricted form certain functionalities.[authenticate-users](./testing/cypress/e2e/user_auth.cy.js)
9) Moderate posts :- Admin has the ability to delete questions, answers and tags. [moderate-posts](./testing/cypress/e2e/moderate_posts.cy.js)

## Work for extra credit:

1) Implemented MaterialUI to beautify the webpage.
2) Test coverage of above 90% in jest and over 88% in cypress tests.
3) Additional security features
   - Added a URL Parsing Middleware to prevent MongoDB injections.
   - Encoded the token cookies with SHA-256.
   - Rate-linited the users to 100 requests per minute to prevent DDOS and DOS attacks.
   - Restricted the input size to 1 KB to prevent server overloading attacks.
   - Secured endpoint with type checking.

## Incremental Features:
1) Guest User with restricted access.
2) Allow search on tag page.
3) Search page for users.
4) Edit profile and update password feature for users.

## Tests for Every Server end-point
**End-Points-Related-Tests**

User-Related Functions

1. Verify Users: [verify-user tests](./server/tests/user.test.js#L16-L96)
   1. Confirms user authentication with correct passwords.
   2. Returns an error for incorrect passwords.
   3. Handles user authentication failures due to no matching credentials.
   4. Manages exceptions during user authentication due to internal server errors.

2. Logout: [logout tests](./server/tests/user.test.js#L100-L120)
   1. Effectively logs out users by invalidating tokens.

3. Add User: [addUser tests](./server/tests/user.test.js#L133-L217)
   1. Successfully registers new users into the system.
   2. Checks for email uniqueness to prevent duplicate registrations.
   3. Validates email formats and password strength to ensure data integrity.
   4. Handles registration failures gracefully with appropriate error messages.

4. Login as Guest: [loginAsGuest tests](./server/tests/user.test.js#L220-L286)
   1. Facilitates guest user logins.
   2. Ensures only valid guest credentials are accepted.
   3. Provides clear feedback for login errors, including incorrect passwords and internal server issues.

5. Update Profile: [updateProfile tests](./server/tests/user.test.js#L289-L379)
   1. Allows users to successfully update their profiles.
   2. Requires authentication token for profile updates.
   3. Validates the correctness of the old password for security.

6. Get My User Details: [getMyUserDetails tests](./server/tests/user.test.js#L384-l455)
   1. Retrieves authenticated user details.
   2. Ensures that user details retrieval is secured with authentication.
   3. Suggests the need for additional testing in areas such as password correctness and user existence.

7. Get User Details: [getUserDetails tests](./server/tests/user.test.js#L458-L516)
   1. Provides detailed user information upon successful authentication.
   2. Manages not found errors when user IDs do not exist in the database.

8. Get Users By Username: [getUsersByUsername tests](./server/tests/user.test.js#L518-L600)
   1. Searches and retrieves user lists based on username queries.
   2. Handles errors effectively when user retrieval processes fail.

Tag-Related Functions

1. Get Tags With Question Number: [getTagsWithQuestionNumber tests](./server/tests/tags.test.js#L100-L150)
   1. Retrieves tags along with associated question counts based on queries.
   2. Indicates the need for additional tests for robust error handling and authentication checks.

2. Update Tag Description: [updateTagDescription tests](./server/tests/tags.test.js#L152-L202)
   1. Permits only administrators to update tag descriptions.
   2. Validates the presence of necessary parameters for tag updates.
   3. Ensures tag existence before permitting updates.

3. Delete Tag: [deleteTag tests](./server/tests/tags.test.js#L204-L254)
   1. Allows tag deletion by administrators.
   2. Secures the tag deletion process against unauthorized user actions.
   3. Confirms tag existence prior to deletion, handling not found errors appropriately.

ANSWER- RELATED FUNCTION

1. Add Answer: [addAnswer tests](./server/tests/newAnswer.test.js#L10-L60)
   1. Successfully adds a new answer to a question when valid data is provided.
   2. Fails to add an answer and returns an error when incorrect input is provided.

2. Upvote Answer: [upvoteAnswer tests](./server/tests/newAnswer.test.js#L62-L112)
   1. Successfully adds an upvote to an answer when no previous upvote exists.
   2. Returns an error when the user is a guest and attempts to upvote.
   3. Returns an error when the answer does not exist.

3. Downvote Answer: [downvoteAnswer tests](./server/tests/newAnswer.test.js#L114-L164)
   1. Successfully adds a downvote to an answer when no previous downvote exists.
   2. Returns an error when the user is a guest and attempts to downvote.
   3. Returns an error when the answer does not exist.

4. Get Answer By ID: [getAnswerById tests](./server/tests/newAnswer.test.js#L166-L216)
   1. Successfully retrieves an answer when it exists.
   2. Returns an error when the answer does not exist.

5. Delete Answer: [deleteAnswer tests](./server/tests/newAnswer.test.js#L218-L268)
   1. Allows deletion of an answer by the user who posted it or by a moderator.
   2. Returns an error when the answer does not exist.
   3. Prevents deletion by users who are neither the original poster nor a moderator.

6. Get All Answers By UID: [getAllAnswersByUid tests](./server/tests/newAnswer.test.js#L270-L320)
   1. Returns all answers posted by a specific user when user ID is valid.
   2. Returns an empty array when the user ID is invalid or when no answers are found.

QUESTION- RELATED FUNCTION

1. Get Question: [getQuestion tests](./server/tests/newQuestion.test.js#L10-L60)
   1. Returns questions based on filter and order.
   2. Checks authorization and query parameter handling.

2. Get Question By ID: [getQuestionById tests](./server/tests/newQuestion.test.js#L62-L112)
   1. Successfully retrieves question details for a specific ID.
   2. Returns error when parameters are incorrect or the question ID does not exist.

3. Add Question: [addQuestion tests](./server/tests/newQuestion.test.js#L114-L164)
   1. Successfully adds a question when all parameters are correct.
   2. Returns status code 401 when a guest account tries to add a question.
   3. Returns status code 400 for missing or invalid question parameters.

4. Downvote Question: [downvoteQuestion tests](./server/tests/newQuestion.test.js#L166-L216)
   1. Successfully downvotes a question if the question exists.
   2. Returns an error if the question does not exist or if the user is a guest.

5. Delete Question: [deleteQuestion tests](./server/tests/newQuestion.test.js#L218-L268)
   1. Allows question deletion by the original poster or a moderator.
   2. Returns an error for unauthorized user or if the question does not exist.

6. Upvote Question: [upvoteQuestion tests](./server/tests/newQuestion.test.js#L270-L320)
   1. Successfully upvotes a question if the question exists.
   2. Returns an error if the question does not exist or if the user is a guest.

COMMENT- RELATED FUNCTION

1. Add Comment to Answer: [addCommentToAnswer tests](./server/tests/comment.test.js#L10-L60)
   1. Successfully adds a comment to an answer when all parameters are correct.
   2. Displays an error when the user is a guest and attempts to add a comment.
   3. Throws an error when the user is not found.

2. Add Comment to Question: [addCommentToQuestion tests](./server/tests/comment.test.js#L62-L112)
   1. Successfully adds a comment to a question when all parameters are correct.
   2. Displays an error when the user is a guest.
   3. Throws an error when the user is not found.

3. Downvote Comment: [downvoteComment tests](./server/tests/comment.test.js#L114-L164)
   1. Successfully downvotes a comment when all parameters are correct.
   2. Returns an error when the comment does not exist.
   3. Prevents a guest from downvoting a comment.

4. Upvote Comment: [upvoteComment tests](./server/tests/comment.test.js#L166-L216)
   1. Successfully upvotes a comment that hasn't been upvoted by the user.
   2. Returns an error when attempting to upvote a comment that has already been upvoted by the user.
   3. Returns an error when the comment does not exist or if the user is a guest.

5. Delete Comment: [deleteComment tests](./server/tests/comment.test.js#L218-L268)
   1. Successfully deletes a comment when the user has permission.
   2. Returns an error when the comment is not found or when the user does not have permission to delete.
   3. Handles internal server errors effectively.


ADDITIONAL TESTS FOR MIDDLEWARE BEING USED. 


1. Token Validation and User Retrieval: [getUserFromToken tests](./server/tests/middleware.test.js#L10-L60)
   1. Sets `req.user` correctly when a valid token is provided, verifying the token and retrieving user details.
   2. Returns status code 401 if no token is provided, indicating the user is unauthorized due to missing token.
   3. Returns status code 401 if the token is invalid, either due to tampering or expiration, ensuring security.
   4. Returns status code 404 if no user corresponds to the decoded token, handling cases where the token's user might have been deleted or is invalid.
   5. Handles other errors by returning status code 500, covering unexpected issues like database failures or token parsing errors.
   
ADDITIONAL TESTS FOR HELPER METHODS BEING USED.

1. User Authentication: [getUserFromToken tests](./server/tests/auth.test.js#L10-L60)
   1. Returns the user when the token is valid and the user exists in the database.
   2. Throws an error when the token is invalid, ensuring security protocols are enforced.
   3. Throws an error when the token is expired, managing access control effectively.
   4. Handles internal server errors during the authentication process.

2. Tag Management: [addTag tests](./server/tests/tag.test.js#L62-L112)
   1. Creates a new tag if it does not already exist, expanding the database of tags.
   2. Returns the ID of an existing tag when it is found in the database, avoiding duplicates.
   3. Handles errors during tag creation, ensuring robustness in tag management.

3. Question Ordering: [getQuestionsByOrder tests](./server/tests/question.test.js#L114-L164)
   1. Fetches questions ordered by newest, supporting timely content delivery.
   2. Fetches questions ordered by active status, highlighting ongoing discussions.
   3. Fetches questions with no answers, facilitating engagement on unresolved queries.
   4. Handles errors during question retrieval, maintaining system stability.

4. Question Filtering: [filterQuestionsBySearch tests](./server/tests/question.test.js#L166-L216)
   1. Filters questions based on tags, facilitating topic-specific searches.
   2. Filters questions based on keywords, enhancing content relevancy.
   3. Filters questions by username, personalizing user experience.
   4. Combines multiple search parameters (tags, keywords, username) for comprehensive filtering.
   5. Returns all questions when no search parameters are provided, ensuring complete data accessibility.

   


## Instructions to generate and view coverage report 

In Both cases before running tests for test coverage locally.

1. got to [config](./server/config.js)
2. uncomment lines 9-11.
3. comment lines 5-7.


**Instuctions for Frontend Test Coverage**

1. Open the terminal
2. cd server
3. npm install
4. nodemon server.js

1. Open new terminal
2. cd client
3. npm install
4. npm start

1. Open new Terminal
2. cd testing
3. npm install
4. npx cypress run

A coverage folder gets created in the testing folder. You can see an Icov-report/index.html, which can be opened on a web-browser to see the coverage.


**Instuctions for Backend Test Coverage**
1. Open the terminal
2. cd server
3. npm install
4. jest -w=1 --coverage --detectOpenHandles

This should give coverge of around 90.32% of functions, and 87.03% of lines in the server.
server.js has calls to third party middleware which restricts testing to only 68.51% of the lines.
