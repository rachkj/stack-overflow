// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

// if (!userArgs[0].startsWith('mongodb')) {
//     console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
//     return
// }

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/users')
let Comment = require("./models/comments");
const crypto = require('crypto');

let mongoose = require('mongoose');
const comments = require('./models/comments');
// let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
// mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




function tagCreate(name, description) {
  let tag = new Tag({ name: name , description: description});
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, comments) {
  let answerdetail = {text:text,
    comments:comments||[],
    upvotes:[ans_by],
    downvotes:[]
  };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views, comments) {
  let qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
    comments:comments||[],
    upvotes:[asked_by],
    downvotes:[]
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}



function createComment(text, comment_by, comment_time) {
  let commentDetail = {
    text: text,
    comment_by: comment_by,
    comment_time: comment_time,
    upvotes: [comment_by],
    downvotes: []
  };

  let comment = new Comment(commentDetail);
  return comment.save();
}

module.exports = createComment;



function userCreate(name, email, password, type) {
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return Promise.reject(new Error('Name, email, and password must be strings'));
  }

  let userdetail = {
    type: type !== undefined ? type : 0
  };

  if (name != false) userdetail.name = name;
  if (email != false) userdetail.email = email;
  if (password != false) userdetail.password = crypto.createHash('sha256').update(password).digest('hex');
  userdetail.impressions = 0;

  let user = new User(userdetail);
  return user.save();
}

const populate = async () => {
  let t1 = await tagCreate('react','A JavaScript library for building user interfaces');
  let t2 = await tagCreate('javascript', 'A programming language commonly used for web development');
  let t3 = await tagCreate('android-studio','An integrated development environment (IDE) for Android app development' );
  let t4 = await tagCreate('shared-preferences', 'A way to store primitive data in key-value pairs in Android');
  let t5 = await tagCreate('storage', 'The process of storing and retrieving data in a structured manner');
  let t6 = await tagCreate('website','A collection of web pages accessible via the internet');
  let t7 = await tagCreate('node-js', 'An asynchronous event-driven JavaScript runtime, designed to build scalable network applications');
let t8 = await tagCreate('sql', 'Structured Query Language used for managing data held in a relational database management system');
let t9 = await tagCreate('authentication', 'The process of verifying the identity of a user or system');
let t10 = await tagCreate('deployment', 'The process of making a software system available for use');
let t11 = await tagCreate('containerization', 'The encapsulation of an application and its dependencies fr scalability');
let t12 = await tagCreate('api-design', 'The process of creating APIs that are easy to use and understand');
let t13 = await tagCreate('web-security', 'Practices and technologies used to protect websites and web applications from cyber threats');
let t14 = await tagCreate('data-structures', 'The organization, management, and storage of data for efficient access and modification');
await tagCreate('algorithms', 'A step-by-step procedure for solving a problem, often expressed in the form of a finite set of instructions');
await tagCreate('machine-learning', 'A field of artificial intelligence that uses statistical techniques to enable computers to learn and improve from experience');
 await tagCreate('cloud-computing', 'The delivery of computing services, including servers, storage, databases, networking, and software, over the internet');
await tagCreate('frontend-development', 'The development of the user interface and user experience of a website or web application');
await tagCreate('backend-development', 'The development of the server-side logic and database management of a website or web application');
await tagCreate('mobile-development', 'The development of applications for mobile devices such as smartphones and tablets');



   let u1 = await userCreate('JohnDoe','john.doe@example.com','password1',0);
let u2 = await userCreate('JaneDoe','jane.doe@example.com','password2',0);
let u3 = await userCreate('AliceSmith','alice.smith@example.com','password3',0);
let u4 = await userCreate('BobJohnson','bob.johnson@example.com','password4',0);
let u5 = await userCreate('EmilyBrown','emily.brown@example.com','password5',0);
let u6 = await userCreate('MichaelClark','michael.clark@example.com','password6',0);
let u7 = await userCreate('OliviaTaylor','olivia.taylor@example.com','password7',0);
let u8 = await userCreate('DanielWilson','daniel.wilson@example.com','password8',0);
let u9 = await userCreate('SophiaMoore','sophia.moore@example.com','password9',0);
let u10 = await userCreate('EthanAnderson','ethan.anderson@example.com','password10',0);
let u11 = await userCreate('AvaWhite','ava.white@example.com','password11',0);
let u12 = await userCreate('WilliamJones','william.jones@example.com','password12',0);
let u13=await userCreate('IsabellaLee','isabella.lee@example.com','password13',0);
let u14=await userCreate('JamesHarris','james.harris@example.com','password14',0);
let u15=await userCreate('CharlotteMartin','charlotte.martin@example.com','password15',0);
let u16=await userCreate('MasonThompson','mason.thompson@example.com','password16',0);
await userCreate('ScarlettGarcia','scarlett.garcia@example.com','password17',0);

await userCreate('guest','testGuest@gmail.com','1234',1);
await userCreate('admin','admin@gmail.com','1234',3);


let c1 = await createComment('This is a comment',u1,new Date('2023-02-19T18:20:59'));


  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', u1 , new Date('2023-11-20T03:24:42'),[]);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', u2 , new Date('2023-11-23T08:24:00'),[]);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',u3 , new Date('2023-11-18T09:24:00'),[]);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',u4 , new Date('2023-11-12T03:30:00'),[]);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', u5 , new Date('2023-11-01T15:24:19'),[]);
  let a6 = await answerCreate('Storing content as BLOBs in databases.', u6 , new Date('2023-02-19T18:20:59'),[]);
  let a7 = await answerCreate('Using GridFS to chunk and store content.', u7, new Date('2023-02-22T17:19:00'),[]);
  let a8 = await answerCreate('Store data in a SQLLite database.', u8 , new Date('2023-03-22T21:17:53'),[]);
  await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], u9 , new Date('2022-01-20T03:00:00'), 10,[]);
  await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], u10, new Date('2023-01-10T11:24:30'), 121,[]);
  await questionCreate('Object storage for a web application', 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.', [t5, t6], [a6], u11, new Date('2023-02-18T01:02:15'), 200,[]);
  await questionCreate('Quick question about storage on android', 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains', [t13, t14, t5], [a7], u12, new Date('2023-03-10T14:28:01'), 103,[]);
  await questionCreate('Handling state in React components', 'I am struggling to manage state in my React components efficiently. Can anyone provide some tips or best practices?', [t1, t7, t8], [a8], u13, new Date('2022-05-15T08:00:00'), 15,[]);

await questionCreate('Optimizing SQL queries for performance', 'I have some SQL queries that are running slowly on my database. How can I optimize them for better performance?', [t2, t9], [], u14, new Date('2022-06-20T10:30:00'), 45,[]);

await questionCreate('Secure authentication methods for web applications', 'What are some secure authentication methods that I can implement in my web application to protect user data?', [t6, t10], [], u15, new Date('2022-07-25T15:45:00'), 27,[]);

await questionCreate('Implementing RESTful APIs in Node.js', 'I need guidance on how to design and implement RESTful APIs using Node.js. Any recommendations or resources?', [t12, t5, t11], [], u16, new Date('2022-08-30T12:15:00'), 65,[]);

await questionCreate('Deployment strategies for containerized applications', 'What are some common deployment strategies for containerized applications, and how do they differ?', [t4, t3], [], u7, new Date('2022-09-10T09:00:00'), 78,[c1]);

  if(db) db.close();
  console.log('done');
}

// populate()
//   .catch((err) => {
//     console.log('ERROR: ' + err);
//     if(db) db.close();
//   });

// console.log('processing ...');

module.exports = populate;



