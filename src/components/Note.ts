import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class NoteElement extends LitElement {
  @property({ type: String }) title: string = "Title";
  @property({ type: String }) content: string = "";
  @property({ type: String }) date: string = new Date().toLocaleDateString();
  @property({ type: String }) backgroundColor: string = "";
  @property({ type: String }) id: string = "-1";

  static styles = css`
    .note {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px;
      border-radius: 8px;
      height: 200px;
      position: relative;
    }
    h2 {
      margin: 0;
      color: #282149;
      font-family: "Montserrat", sans-serif;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    p {
      height: 100px;
      margin: 10px 0;
      color: #555;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    small {
      color: #777;
    }
    .delete-btn {
      position: absolute;
      bottom: 16px;
      right: 16px;
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
    }
    .delete-btn:hover {
      opacity: 0.6;
    }
    .edit-btn {
      position: absolute;
      bottom: 16px;
      right: 42px;
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
    }
    .edit-btn:hover {
      opacity: 0.6;
    }
  `;

  private handleDelete() {
    this.dispatchEvent(
      new CustomEvent("delete-note", {
        detail: { id: this.id },
        bubbles: true, //propaga al padre
        composed: true,
      })
    );
  }

  private handleEdit() {
    this.dispatchEvent(
      new CustomEvent("edit-note", {
        detail: { id: this.id, title: this.title, content: this.content },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="note" style="background-color: ${this.backgroundColor}">
        <div>
          <h2>${this.title}</h2>
          <p>${this.content}</p>
        </div>
        <small>Last update: ${this.date}</small>
        <button class="delete-btn" @click=${this.handleDelete}>🗑️</button>
        <button class="edit-btn" @click=${this.handleEdit}>✏️</button>
      </div>
    `;
  }
}

customElements.define("note-card", NoteElement);
