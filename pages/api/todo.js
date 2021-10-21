import { client } from "../../utils/database.js";
import { ObjectId } from "mongodb";

export default async function handler(request, response) {
  try {
    const isMethodPost = request.method === "POST"; //asking whether it's a POST request
    if (!isMethodPost) {
      response.status(404).json({ error: "it's not a POST request" });
    }
    // Connect the client to the server, select db and collection
    await client.connect();
    const db = client.db("todoapp");
    const collection = db.collection("todos");
    const { _id, ...updatedTodo } = request.body;
    console.log(updatedTodo);
    // find, update or insert data - your code goes here:
    await collection.updateOne(
      { _id: ObjectId(_id) }, //which document should be updated comes in the first {},
      { $set: updatedTodo } //what should be updated (new value) comes after the coma ','
    );

    const data = await collection.findOne({ _id: ObjectId(_id) });
    // respond with data…
    console.log("DATA to do", data);
    response.status(200).json(data);
  } catch (error) {
    // or you can just write catch without (error)
    response.status(500).json({ error: "Something went wrong!" });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
