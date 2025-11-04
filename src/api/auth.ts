import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../schemas";
import { and, eq } from "drizzle-orm";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey123";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "No credentials input", data: {} });
  }
  
  const result = (await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.email, email),
        eq(users.password, password)
      )
    ))[0];


  if(!result) {
    return res.status(401).json({ message: "Invalid credentials", data: {} });
  }
  
  const token = jwt.sign({ id: result.id, email: result.email  }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    message: "Login successful",
    data: {
      token
    }
  });
});

function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = decoded; 
    next();
  });
}

router.get("/profile", authenticateToken, (req: any, res) => {
  res.json({
    message: "Protected route accessed",
    data: req.user,
  });
});

export default router;
