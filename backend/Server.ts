import express from "express";
import morgan from "morgan";
import rootRouter from "./routes/Root";
import userRouter from "./routes/auth/User";

const PORT = 3000;

const server = express();

server.use(express.json());
server.use(morgan("dev"));
server.use(userRouter);
server.use(rootRouter);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
