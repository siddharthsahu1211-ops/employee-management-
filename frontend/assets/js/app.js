import express from "express";
import employeeRouter from "./routes/employee.js";  // existing
import complaintRouter from "./routes/complaint.js"; // new

const app = express();

app.use(express.json());
app.use("/api/employee", employeeRouter);
app.use("/api/complaint", complaintRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
