// Unit tests for addAnswer in contoller/answer.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");
const {your_secret_key} = require('../config')
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/users");

const Comment = require("../models/comments");
const answers = require("../models/answers");
const jwt = require('jsonwebtoken');

const token = jwt.sign({ email: 'test1@gmail.com'}, your_secret_key, { expiresIn: '1h' });

// Mock the Answer model
jest.mock("../models/answers");
jest.mock("../models/users");
jest.mock("../models/questions");


let server;
describe("POST /addAnswer", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it("should add a new answer to the question", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer"
      }
    };

    const mockAnswer = {
      _id: "dummyAnswerId",
      text: "This is a test answer",
      ans_by: {
        name: "Dummy User",
        email: "dummy@example.com",
        password: "password123",
        type: 1, // Assuming type 1 is a regular user, adjust as needed
        impressions: 0 // Starting impressions count, adjust as needed
      },
      ans_date_time: new Date().toDateString(), // Replace with the current date and time or a specific date and time
      comments: [], // Leave empty for now
      upvotes: [], // Leave empty for now
      downvotes: [] // Leave empty for now
    }
    
    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    const decodedUser = {
        email: "test@example.com"
    };

    // Mock the User.findOne method to return a user
    User.findOne.mockResolvedValueOnce(decodedUser);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .send(mockReqBody)
      .set('Cookie', `token=${token}`);

    // Asserting the response
    expect(response.body).toEqual(mockAnswer);
    expect(response.status).toBe(200);
    

    // Verifying that Answer.create method was called with the correct arguments
    // expect(Answer.create).toHaveBeenCalledWith({
    //   text: "This is a test answer"
    // });

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyQuestionId" },
      { $push: { answers: { $each: ["dummyAnswerId"], $position: 0 } } },
      { new: true }
    );
  });

  it("should fail on wrong answer", async () => {
      const decodedUser = {
        email: "test@example.com"
    };

    // Mocking the request body
    const mockAnswer = {
      text: "This is a test answer",
      ans_by: decodedUser,
      //ans_date_time: new Date().toDateString(), // Replace with the current date and time or a specific date and time
      comments: [], // Leave empty for now
      upvotes: [decodedUser], // Leave empty for now
      downvotes: [] // Leave empty for now
    }
    const mockReqBody = {
      ans: mockAnswer
    };
    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    
    // Mock the User.findOne method to return a user
    User.findOne.mockResolvedValueOnce(decodedUser);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .set('Cookie', `token=${token}`)
      .send(mockReqBody);

    // Asserting the response

    expect(response.body).toEqual({ message: "Error adding answer", error: "Incorrect Input"});
    expect(response.status).toBe(500);
    

    //Verifying that Answer.create method was called with the correct arguments
    expect(Answer.create).toHaveBeenCalledWith(mockAnswer);
  });


});






describe("GET /upvoteAnswer", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  

  it("add an upvote when no upvote exist", async () => {

    const decodedUser = {
      _id:'mockuserid',
      email: "test1@example.com",
      type: 0
    };
  
    const mockAnswer = {
      upvotes:[],
      downvotes:[],
    };

    const resolvedAnswer = {
      upvotes:[decodedUser._id],
      downvotes:[],
    };

    const mockparams = {
      aid: 'mockAnswerId'
    }

    User.findOne.mockResolvedValueOnce(decodedUser);
    Answer.findById.mockResolvedValueOnce(mockAnswer);
    Answer.findByIdAndUpdate.mockResolvedValueOnce(resolvedAnswer);
  
    const response = await supertest(server)
      .get(`/answer/upvoteAnswer/${mockparams.aid}`)
      .set('Cookie', `token=${token}`);

    expect(response.body).toEqual(resolvedAnswer);
    expect(response.status).toBe(200);
    
    expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
    expect(Answer.findByIdAndUpdate).toHaveBeenCalledWith(
      mockparams.aid, 
      { $push: { upvotes: decodedUser._id } },
      { new: true }
    );
  });


  it("throw error when user type is guest", async () => {

    const decodedUser = {
      _id:'mockuserid',
      email: "test1@example.com",
      type: 1
    };

    const mockparams = {
      aid: 'mockAnswerId'
    }

    User.findOne.mockResolvedValueOnce(decodedUser);

    const response = await supertest(server)
      .get(`/answer/upvoteAnswer/${mockparams.aid}`)
      .set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
  });

  it("throw error when answer not found", async () => {

    const decodedUser = {
      _id:'mockuserid',
      email: "test1@example.com",
      type: 0
    };

    const mockparams = {
      aid: 'mockAnswerId'
    }

    User.findOne.mockResolvedValueOnce(decodedUser);
    Answer.findById.mockResolvedValueOnce(undefined);


    const response = await supertest(server)
      .get(`/answer/upvoteAnswer/${mockparams.aid}`)
      .set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
  });
});





  


//   describe("GET /downvoteAnswer", () => {

//     beforeEach(() => {
//       server = require("../server");
//     })
  
//     afterEach(async() => {
//       server.close();
//       await mongoose.disconnect()
//     });
  
    
  
//     it("add an upvote when no upvote exist", async () => {
  
//       const decodedUser = {
//         _id:'mockuserid',
//         email: "test1@example.com",
//         type: 0
//       };
    
//       const mockAnswer = {
//         upvotes:[],
//         downvotes:[],
//       };
  
//       const resolvedAnswer = {
//         upvotes:[],
//         downvotes:[decodedUser._id],
//       };
  
//       const mockparams = {
//         aid: 'mockAnswerId'
//       }
  
//       User.findOne.mockResolvedValueOnce(decodedUser);
//       Answer.findById.mockResolvedValueOnce(mockAnswer);
//       Answer.findByIdAndUpdate.mockResolvedValueOnce(resolvedAnswer);
    
//       const response = await supertest(server)
//         .get(`/answer/upvoteAnswer/${mockparams.aid}`)
//         .set('Cookie', `token=${token}`);
  
//       expect(response.body).toEqual(resolvedAnswer);
//       expect(response.status).toBe(200);
      
//       expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
//       expect(Answer.findByIdAndUpdate).toHaveBeenCalledWith(
//         mockparams.aid, 
//         { $push: { upvotes: decodedUser._id } },
//         { new: true }
//       );
//     });
  
  
//     it("throw error when user type is guest", async () => {
  
//       const decodedUser = {
//         _id:'mockuserid',
//         email: "test1@example.com",
//         type: 1
//       };
  
//       const mockparams = {
//         aid: 'mockAnswerId'
//       }
  
//       User.findOne.mockResolvedValueOnce(decodedUser);
  
//       const response = await supertest(server)
//         .get(`/answer/upvoteAnswer/${mockparams.aid}`)
//         .set('Cookie', `token=${token}`);
  
//       expect(response.status).toBe(401);
//     });
  
//     it("throw error when answer not found", async () => {
  
//       const decodedUser = {
//         _id:'mockuserid',
//         email: "test1@example.com",
//         type: 0
//       };
  
//       const mockparams = {
//         aid: 'mockAnswerId'
//       }
  
//       User.findOne.mockResolvedValueOnce(decodedUser);
//       Answer.findById.mockResolvedValueOnce(undefined);
  
  
//       const response = await supertest(server)
//         .get(`/answer/upvoteAnswer/${mockparams.aid}`)
//         .set('Cookie', `token=${token}`);
  
//       expect(response.status).toBe(404);
//     });

// });


describe("GET /downvoteAnswer", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  

  it("add a downvote when no downvote exist", async () => {

    const decodedUser = {
      _id:'mockuserid',
      email: "test1@example.com",
      type: 0
    };
  
    const mockAnswer = {
      upvotes:[],
      downvotes:[],
    };

    const resolvedAnswer = {
      upvotes:[],
      downvotes:[decodedUser._id],
    };

    const mockparams = {
      aid: 'mockAnswerId'
    }

    User.findOne.mockResolvedValueOnce(decodedUser);
    Answer.findById.mockResolvedValueOnce(mockAnswer);
    Answer.findByIdAndUpdate.mockResolvedValueOnce(resolvedAnswer);
  
    const response = await supertest(server)
      .get(`/answer/downvoteAnswer/${mockparams.aid}`)
      .set('Cookie', `token=${token}`);

    expect(response.body).toEqual(resolvedAnswer);
    expect(response.status).toBe(200);
    
    expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
    expect(Answer.findByIdAndUpdate).toHaveBeenCalledWith(
      mockparams.aid, 
      { $push: { upvotes: decodedUser._id } },
      { new: true }
    );
  });


  it("throw error when user type is guest", async () => {

    const decodedUser = {
      _id:'mockuserid',
      email: "test1@example.com",
      type: 1
    };

    const mockparams = {
      aid: 'mockAnswerId'
    }

    User.findOne.mockResolvedValueOnce(decodedUser);

    const response = await supertest(server)
      .get(`/answer/downvoteAnswer/${mockparams.aid}`)
      .set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
  });

  it("throw error when answer not found", async () => {

    const decodedUser = {
      _id:'mockuserid',
      email: "test1@example.com",
      type: 0
    };

    const mockparams = {
      aid: 'mockAnswerId'
    }

    User.findOne.mockResolvedValueOnce(decodedUser);
    Answer.findById.mockResolvedValueOnce(undefined);


    const response = await supertest(server)
      .get(`/answer/downvoteAnswer/${mockparams.aid}`)
      .set('Cookie', `token=${token}`);

    expect(response.status).toBe(404);
  });

});


describe("GET /getAnswerById", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

      

      it("gets answer when it exists", async () => {

        const decodedUser = {
          _id:'mockuserid',
          email: "test1@example.com",
          type: 0
        };

        const mockComment = {
          _id: 'mockCommentId',
          text: 'Mock comment text',
      };
      
        const mockAnswer = {
          _id: 'mockAnswerId',
          upvotes:[],
          downvotes:[],
          comments:[mockComment],
        };
        const mockparams = {
          aid: 'mockAnswerId'
        }

        

        User.findOne.mockResolvedValueOnce(decodedUser);

        // Mock the return value of findById to have a populate method
        Answer.findById.mockReturnValueOnce({
          populate: jest.fn().mockResolvedValueOnce(mockAnswer)
      });


        // Answer.findById.mockResolvedValueOnce(mockAnswer);
      
        const response = await supertest(server)
          .get(`/answer/getAnswerById/${mockparams.aid}`)
          .set('Cookie', `token=${token}`);

        expect(response.body).toEqual(mockAnswer);
        expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
        expect(response.status).toBe(200);
        
    });

    it("gets error when no answer", async () => {

      const decodedUser = {
        _id:'mockuserid',
        email: "test1@example.com",
        type: 0
      };

      const mockComment = {
        _id: 'mockCommentId',
        text: 'Mock comment text',
    };

      const mockAnswer = {
        _id: 'mockAnswerId',
        upvotes:[],
        downvotes:[],
        comments:[mockComment],
      };
      const mockparams = {
        aid: 'mockAnswerId'
      }

      

      User.findOne.mockResolvedValueOnce(decodedUser);

      // Mock the return value of findById to have a populate method
      Answer.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(undefined)
    });


      // Answer.findById.mockResolvedValueOnce(mockAnswer);

      const response = await supertest(server)
        .get(`/answer/getAnswerById/${mockparams.aid}`)
        .set('Cookie', `token=${token}`);

      //expect(response.body).toEqual(mockAnswer);
      expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
      expect(response.status).toBe(500);
      
    });

});










describe("DELETE /deleteAnswer", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

      

      it("delete anser if it exists and made by user", async () => {

        const decodedUser = {
          _id:'mockuserid',
          email: "test1@example.com",
          type: 0
        };

        const mockComment = {
          _id: 'mockCommentId',
          text: 'Mock comment text',
      };
      
        const mockAnswer = {
          _id: 'mockAnswerId',
          upvotes:[],
          downvotes:[],
          comments:[mockComment],
          ans_by: decodedUser._id
        };
        const mockparams = {
          aid: 'mockAnswerId'
        }

        

        User.findOne.mockResolvedValueOnce(decodedUser);
        Answer.findById.mockResolvedValueOnce(mockAnswer);

        // Mock the return value of findById to have a populate method
        Answer.findByIdAndDelete.mockReturnValueOnce(undefined);


        
      
        const response = await supertest(server)
          .delete(`/answer/deleteAnswer/${mockparams.aid}`)
          .set('Cookie', `token=${token}`);

        //expect(response.body).toEqual(mockAnswer);
        expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
        expect(response.status).toBe(200);
        
    });

    it("delete anser if it exists and deleted by mod", async () => {

      const decodedUser = {
        _id:'mockuserid',
        email: "test1@example.com",
        type: 3
      };

      const mockComment = {
        _id: 'mockCommentId',
        text: 'Mock comment text',
    };
    
      const mockAnswer = {
        _id: 'mockAnswerId',
        upvotes:[],
        downvotes:[],
        comments:[mockComment],
        ans_by: "not og user"
      };
      const mockparams = {
        aid: 'mockAnswerId'
      }

      

      User.findOne.mockResolvedValueOnce(decodedUser);
      Answer.findById.mockResolvedValueOnce(mockAnswer);

      // Mock the return value of findById to have a populate method
      Answer.findByIdAndDelete.mockReturnValueOnce(undefined);


      
    
      const response = await supertest(server)
        .delete(`/answer/deleteAnswer/${mockparams.aid}`)
        .set('Cookie', `token=${token}`);

      //expect(response.body).toEqual(mockAnswer);
      expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
      expect(response.status).toBe(200);
      
  });


    it("throw error if no answer exist", async () => {

      const decodedUser = {
        _id:'mockuserid',
        email: "test1@example.com",
        type: 3
      };

      const mockComment = {
        _id: 'mockCommentId',
        text: 'Mock comment text',
    };
    
      const mockAnswer = {
        _id: 'mockAnswerId',
        upvotes:[],
        downvotes:[],
        comments:[mockComment],
        ans_by: "not og user"
      };
      const mockparams = {
        aid: 'mockAnswerId'
      }

      

      User.findOne.mockResolvedValueOnce(decodedUser);
      Answer.findById.mockResolvedValueOnce(undefined);

      // Mock the return value of findById to have a populate method
      Answer.findByIdAndDelete.mockReturnValueOnce(undefined);


      
    
      const response = await supertest(server)
        .delete(`/answer/deleteAnswer/${mockparams.aid}`)
        .set('Cookie', `token=${token}`);

      //expect(response.body).toEqual(mockAnswer);
      expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
      expect(response.status).toBe(404);
      
  });

  it("throw error if delete requested by non mod or user", async () => {

    const decodedUser = {
      _id:'mockuserid',
      email: "test1@example.com",
      type: 0,
    };

    const mockComment = {
      _id: 'mockCommentId',
      text: 'Mock comment text',
  };

    const mockAnswer = {
      _id: 'mockAnswerId',
      upvotes:[],
      downvotes:[],
      comments:[mockComment],
      ans_by: "not og user"
    };
    const mockparams = {
      aid: 'mockAnswerId'
    }

    

    User.findOne.mockResolvedValueOnce(decodedUser);
    Answer.findById.mockResolvedValueOnce(mockAnswer);

    // Mock the return value of findById to have a populate method
    Answer.findByIdAndDelete.mockReturnValueOnce(undefined);


    

    const response = await supertest(server)
      .delete(`/answer/deleteAnswer/${mockparams.aid}`)
      .set('Cookie', `token=${token}`);

    //expect(response.body).toEqual(mockAnswer);
    expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
    expect(response.status).toBe(401);
    
  });

});



describe("GET /getAllAnswersByUid", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect();
  });


      it("gets empty return when uid invalid", async () => {

        const decodedUser = {
          _id:'mockuserid',
          email: "test1@example.com",
          type: 0
        };

        // Mock values
const a1 = {
  text: "Sample answer text 1",
  ans_by: 'mockuserid', // Replace with actual user ID if needed
  ans_date_time: "new Date()",
  comments: [],
  upvotes: [],
  downvotes: []
};

const a2 = {
  text: "Sample answer text 2",
  ans_by: 'mockuserid', // Replace with actual user ID if needed
  ans_date_time: "new Date()",
  comments: [],
  upvotes: [],
  downvotes: []
};

const a3 = {
  text: "Sample answer text 3",
  ans_by: 'differentUser', // Replace with actual user ID if needed
  ans_date_time: "new Date()",
  comments: [],
  upvotes: [],
  downvotes: []
};

const a4 = {
  text: "Sample answer text 4",
  ans_by: 'differentUser', // Replace with actual user ID if needed
  ans_date_time: "new Date()",
  comments: [],
  upvotes: [],
  downvotes: []
};

        const q1 = {
          _id : "mockid1",
          answers:[a1,a3]

        }

        const q2 = {
          _id : "mockid2",
          answers:[a2]

        }

        const q3 = {
          _id : "mockid3",
          answers:[a4]
        }

        const qlist = [q1, q2, q3];

        const answers = [{... a1, qid: "mockid1"}, {... a2, qid: "mockid2" }]
        

        User.findOne.mockResolvedValueOnce(decodedUser);

        // Mock the return value of findById to have a populate method
        Question.find.mockReturnValueOnce({
          populate: jest.fn().mockResolvedValueOnce(qlist)
      });

      


        // Answer.findById.mockResolvedValueOnce(mockAnswer);
      
        const response = await supertest(server)
          .get(`/answer/getAllAnswersByUid/incorrect`)
          .set('Cookie', `token=${token}`);

          
          expect(response.body).toEqual([]);
          expect(response.status).toBe(200);
        //expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
        
        
    });


    it("gets all answers when all parameters are correct", async () => {

      const decodedUser = {
        _id:'mockuserid',
        email: "test1@example.com",
        type: 0
      };

      // Mock values
const a1 = {
text: "Sample answer text 1",
ans_by: 'mockuserid', // Replace with actual user ID if needed
ans_date_time: "new Date()",
comments: [],
upvotes: [],
downvotes: []
};

const a2 = {
text: "Sample answer text 2",
ans_by: 'mockuserid', // Replace with actual user ID if needed
ans_date_time: "new Date()",
comments: [],
upvotes: [],
downvotes: []
};

const a3 = {
text: "Sample answer text 3",
ans_by: 'differentUser', // Replace with actual user ID if needed
ans_date_time: "new Date()",
comments: [],
upvotes: [],
downvotes: []
};

const a4 = {
text: "Sample answer text 4",
ans_by: 'differentUser', // Replace with actual user ID if needed
ans_date_time: "new Date()",
comments: [],
upvotes: [],
downvotes: []
};

      const q1 = {
        _id : "mockid1",
        answers:[a1,a3]

      }

      const q2 = {
        _id : "mockid2",
        answers:[a2]

      }

      const q3 = {
        _id : "mockid3",
        answers:[a4]
      }

      const qlist = [q1, q2, q3];

      const answers = [{... a1, qid: "mockid1"}, {... a2, qid: "mockid2" }]
      

      User.findOne.mockResolvedValueOnce(decodedUser);

      // Mock the return value of findById to have a populate method
      Question.find.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(qlist)
    });

    


      // Answer.findById.mockResolvedValueOnce(mockAnswer);
    
      const response = await supertest(server)
        .get(`/answer/getAllAnswersByUid/${decodedUser._id}`)
        .set('Cookie', `token=${token}`);

        
        expect(response.body).toEqual(answers);
        expect(response.status).toBe(200);
      //expect(Answer.findById).toHaveBeenCalledWith(mockparams.aid);
      
      
  });



});







