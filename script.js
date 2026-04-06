const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const year = document.querySelector("#year");
const noteForm = document.querySelector("#note-form");
const notesList = document.querySelector("#notes-list");
const draftKey = "cs-blog-note-draft";

if (year) {
  year.textContent = new Date().getFullYear();
}

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (header && header.classList.contains("menu-open")) {
      header.classList.remove("menu-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  });
});

if (noteForm instanceof HTMLFormElement) {
  const titleInput = noteForm.elements.namedItem("title");
  const topicInput = noteForm.elements.namedItem("topic");
  const noteInput = noteForm.elements.namedItem("note");

  if (
    titleInput instanceof HTMLInputElement &&
    topicInput instanceof HTMLInputElement &&
    noteInput instanceof HTMLTextAreaElement
  ) {
    const savedDraft = window.localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        titleInput.value = draft.title || "";
        topicInput.value = draft.topic || "";
        noteInput.value = draft.note || "";
      } catch (_error) {
        window.localStorage.removeItem(draftKey);
      }
    }

    const persistDraft = () => {
      const draft = {
        title: titleInput.value,
        topic: topicInput.value,
        note: noteInput.value
      };

      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    };

    titleInput.addEventListener("input", persistDraft);
    topicInput.addEventListener("input", persistDraft);
    noteInput.addEventListener("input", persistDraft);

    noteForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!(notesList instanceof HTMLElement)) {
        return;
      }

      const card = document.createElement("article");
      card.className = "content-card";

      const meta = document.createElement("p");
      meta.className = "card-meta";
      meta.textContent = `${topicInput.value} • just posted`;

      const title = document.createElement("h3");
      title.textContent = titleInput.value;

      const preview = document.createElement("p");
      preview.textContent = noteInput.value.trim().slice(0, 160) + (noteInput.value.trim().length > 160 ? "..." : "");

      const action = document.createElement("a");
      action.href = "#note-editor";
      action.textContent = "Continue editing";

      card.append(meta, title, preview, action);
      notesList.prepend(card);

      noteForm.reset();
      window.localStorage.removeItem(draftKey);
    });

    noteForm.addEventListener("reset", () => {
      window.localStorage.removeItem(draftKey);
    });
  }
}
