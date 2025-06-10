import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import NoteModal from "../NoteModal/NoteModal";
import css from "./App.module.css";
import { useDebounce } from "use-debounce";
import type { Note } from "../../types/note";

function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  type NotesData = {
    notes: Note[];
    totalPages: number;
  };

  const { data, isLoading, isError } = useQuery<NotesData, Error>({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes(page, debouncedSearch),
    staleTime: 5000,
    placeholderData: (previousData) => previousData,
  });

  const handleCloseModal = () => setIsOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value: string) => {
            setSearch(value);
            setPage(1);
          }}
        />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            onPageChange={setPage}
            totalPages={data.totalPages}
          />
        )}
        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && <p>No notes found</p>
      )}
      {isOpen && <NoteModal onClose={handleCloseModal} />}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
    </div>
  );
}

export default App;
