// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Apre la connessione al DB
const openDb = async () => {
  return open({
    filename: "/tmp/notes.db",
    driver: sqlite3.Database,
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await openDb();

  // Creazione tabella DB
  await db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      date TEXT
    )
  `);

  if (req.method === "GET") {
    const notesResponse = await db.all("SELECT * FROM notes");
    res.status(200).json(notesResponse);
  } else if (req.method === "POST") {
    const { title, content, date } = req.body;
    await db.run("INSERT INTO notes (title, content, date) VALUES (?, ?, ?)", [
      title,
      content,
      date,
    ]);
    res.status(201).json({ message: "Note created" });
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    await db.run("DELETE FROM notes WHERE id = ?", [id]);
    res.status(200).json({ message: "Note deleted" });
  } else if (req.method === "PUT") {
    const { id, title, content } = req.body;

    if (!id || !title || !content) {
      return res.status(400).json({ message: "Missing id, title, or content" });
    }
    await db.run(
      "UPDATE notes SET title = ?, content = ?, date = ? WHERE id = ?",
      [title, content, new Date().toLocaleDateString(), id]
    );

    res.status(200).json({ message: "Note updated" });
  } else {
    res.status(400).json({ message: "Method not allowed" });
  }
};
