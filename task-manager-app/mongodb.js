const { MongoClient, ObjectID } = require("mongodb");
const connectURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager-app";

MongoClient.connect(connectURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log("Cannot connect to the database");
  }
  const db = client.db(databaseName);

  // Insert one document
  // db.collection("users").insertOne({ name: "John", age: 29 }, (error, result) => {
  //   if (error) {
  //     return console.log("Unable to insert a document");
  //   }
  //   console.log(result.ops);
  // });

  // Insert multiple documents
  // db.collection("users").insertMany(
  //   [
  //     {
  //       name: "Jack",
  //       age: 21
  //     },
  //     {
  //       name: "Amy",
  //       age: 30
  //     }
  //   ],
  //   (error, result) => {
  //     if (error) {
  //       return console.log("Unable to insert documents");
  //     }
  //     console.log(result.ops);
  //   }
  // );

  // Search a document
  db.collection("users").findOne(
    {
      _id: new ObjectID("5cc4594bd45ecf1639f43ae3")
    },
    (error, user) => {
      if (error) {
        return console.log("Unable to access database");
      }
      console.log(user);
    }
  );

  // Search documents
  db.collection("users").find({age: 29}).toArray((error, users) => {
    if (error) {
      return console.log("Failed to get data");
    }
    console.log(users);
  });
});
