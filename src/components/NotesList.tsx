import { Note } from "@/utils/model";
import React, { useEffect, useState } from "react";

const backgroundColors = ["#dabbfa", "#fff6e2", "#d7f3f5", "#f7d7d7"];
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * backgroundColors.length);
  return backgroundColors[randomIndex];
};

const NotesList = () => {
  const [notesList, setNotesList] = useState<Note[]>([]);

  useEffect(() => {
    import("./Note");
    const fetchNotes = async () => {
      const response = await fetch("/api/notes");
      const data = await response.json();
      setNotesList(data);
    };
    fetchNotes();
  }, []);

  //ADD NOTE
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    const newNote: Note = {
      title: (formData.get("title") as string) || "Untitled Note",
      content: formData.get("content") as string,
      date: new Date().toLocaleDateString(),
    };

    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });

    if (response.ok) {
      const newNotes = await fetch("/api/notes");
      const newNotesList = await newNotes.json();
      setNotesList(newNotesList);
    }

    form.reset();
  };

  //LISTENER WEB COMPONENT EVENTS
  useEffect(() => {
    const deleteListener = (event: Event) => {
      const customEvent = event as CustomEvent;
      handleDelete(customEvent.detail.id);
    };
    const editListener = (event: Event) => {
      const customEvent = event as CustomEvent;
      handleEditNote(customEvent);
    };

    document.addEventListener("delete-note", deleteListener);
    document.addEventListener("edit-note", editListener);

    return () => {
      document.removeEventListener("delete-note", deleteListener);
      document.removeEventListener("edit-note", editListener);
    };
  }, []);

  const handleDelete = async (id: number) => {
    await fetch(`/api/notes?id=${id}`, {
      method: "DELETE",
    });
    const response = await fetch("/api/notes");
    const notes = await response.json();
    setNotesList(notes);
  };

  console.log(notesList);

  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleEditNote = (event: CustomEvent) => {
    const { id, title, content } = event.detail;
    setEditingNote({
      id,
      title,
      content,
      date: new Date().toLocaleDateString(),
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const updatedNote: Note = {
      ...editingNote!,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    };

    const response = await fetch(`/api/notes?id=${editingNote!.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote),
    });

    if (response.ok) {
      const updatedNotes = await fetch("/api/notes");
      const updatedNotesList = await updatedNotes.json();
      setNotesList(updatedNotesList);
      setEditingNote(null); // Reset editing note
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {notesList &&
          notesList.length > 0 &&
          notesList.map((el) => {
            const backgroundColor = getRandomColor();
            return (
              <note-card
                key={el.id}
                id={String(el.id)}
                title={el.title}
                content={el.content}
                date={el.date}
                backgroundColor={backgroundColor}
              ></note-card>
            );
          })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <form
          onSubmit={handleSubmit}
          className="col-span-1 sm:col-span-2 mb-6 p-4 border rounded"
        >
          <h2 className="font-note text-xl mb-2">Add new note</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="p-2 border rounded mb-2"
          />
          <textarea
            name="content"
            placeholder="Write new text here"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="submit"
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
          >
            Add to List
          </button>
        </form>
        {editingNote && (
          <div className="col-span-1 sm:col-span-2 mb-6 p-4 border rounded">
            <h2 className="font-note text-xl mb-2">Edit Note</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="title"
                defaultValue={editingNote.title}
                className="p-2 border rounded mb-2"
              />
              <textarea
                name="content"
                defaultValue={editingNote.content}
                className="w-full p-2 border rounded mb-2"
              />
              <button
                type="submit"
                className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
              >
                Update Note
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
