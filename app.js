import bodyParser from "body-parser";
import axios from "axios";
import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  const language = req.body.language;
  const responseFormat = req.body["response-format"];
  const jokeAmount = req.body["joke-amount"];
  const searchString = req.body["search-string"];
  const from = req.body.from;
  const to = req.body.to;

  const categories = [];
  if (req.body.category == "any") categories.push("any");
  else {
    if (req.body.programming) categories.push("programming");
    if (req.body.misc) categories.push("misc");
    if (req.body.dark) categories.push("dark");
    if (req.body.pun) categories.push("pun");
    if (req.body.spooky) categories.push("spooky");
    if (req.body.christmas) categories.push("christmas");
  }

  const jokeType = [];
  if (req.body.single) jokeType.push("single");
  if (req.body.twopart) jokeType.push("twopart");

  const blacklistFlags = [];
  if (req.body.nsfw) blacklistFlags.push("nsfw");
  if (req.body.religious) blacklistFlags.push("religious");
  if (req.body.political) blacklistFlags.push("political");
  if (req.body.racist) blacklistFlags.push("racist");
  if (req.body.sexist) blacklistFlags.push("sexist");
  if (req.body.explicit) blacklistFlags.push("explicit");

  const API_URL = `https://v2.jokeapi.dev/joke/${categories.join(
    ","
  )}?&lang=${language}&blacklistFlags=${blacklistFlags.join(
    ","
  )}&format=${responseFormat}&type=${jokeType.join(
    ","
  )}&contains=${searchString}&idRange=${from}-${to}&amount=${jokeAmount}`;

  if (
    jokeType.length === 0 ||
    categories.length === 0 ||
    Number(from) > Number(to)
  ) {
    res.render("index.ejs", {
      formData: {
        ...req.body,
        single: req.body.single || null,
        twopart: req.body.twopart || null,
      },
      result:
        "Error:\n\nOne or more of the parameters you specified are invalid.\nThey are outlined with a red border.\n\nPlease correct the parameters and try again.",
    });
    return;
  }

  try {
    const result = await axios.get(API_URL);
    const data =
      typeof result.data == "object"
        ? JSON.stringify(result.data, null, 2)
        : result.data;

    res.render("index.ejs", { result: data, formData: req.body });
  } catch (error) {
    let data = error.response?.data || error.message;
    data = typeof data == "object" ? JSON.stringify(data, null, 2) : data;
    res.render("index.ejs", {
      result: data,
      formData: req.body,
    });
  }
});

app.get("/", (req, res) => {
  res.render("index.ejs", { result: "", formData: {} });
});

app.listen(port, () => {
  console.log(`Server running on a port number ${port}`);
});
