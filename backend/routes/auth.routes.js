import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role)
    return res.status(400).json({ error: "All fields required" });

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing)
    return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role
    }
  });

  res.json({ message: "User registered", role: user.role });
});


/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role)
    return res.status(400).json({ error: "All fields required" });

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user)
    return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(401).json({ error: "Invalid credentials" });

  // 🔥 ROLE CHECK
  if (user.role !== role) {
    return res.status(403).json({
      error: `Access denied for ${role} portal`
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });
});


export default router;
