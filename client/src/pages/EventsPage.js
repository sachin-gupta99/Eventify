import { Suspense } from "react";
import {
  Await,
  defer,
  json,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import EventsList from "../components/EventsList";
import { fallback } from "../Layout/fallback";
import { host } from "../api/host";

const EventsPage = () => {
  const data = useLoaderData();
  const events = data.events;
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const handleSearchChange = (event) => {
    const value = event.target.value;
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
        <input
          type="text"
          placeholder="Search events by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            boxSizing: "border-box",
            outline: "none",
          }}
        />
      </div>
      <Suspense fallback={fallback}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
};

const utilLoader = async (search) => {
  let url = `${host}/events/`;
  if (search && search.trim().length > 0) {
    url += `?search=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw json({ message: "Could not fetch data" }, { status: res.status });
  }
  const data = await res.json();
  return data.events;
};

export const loader = ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  return defer({
    events: utilLoader(search),
  });
};

export default EventsPage;
