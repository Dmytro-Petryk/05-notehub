import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import NoteModal from "../NoteModal/NoteModal";
import css from "./App.module.css";
import { useDebounce } from "use-debounce";

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
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

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isOpen && (
        <NoteModal onClose={() => setIsOpen(false)} children={undefined} />
      )}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
    </div>
  );
}

export default App;
