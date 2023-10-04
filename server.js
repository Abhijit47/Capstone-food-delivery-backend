const app = require("./app");
const connectDB = require("./config/configDB");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`app running on port: ${PORT}`);
});