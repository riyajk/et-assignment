import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import MovieApp from "./App";

// Mock the global fetch function to avoid making actual API requests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        results: [
          {
            title: "A New Hope",
            episode_id: 4,
            opening_crawl: "Opening Crawl 1",
            director: "George Lucas",
            producer: "Gary Kurtz",
            release_date: "1977-05-25",
          },
          {
            title: "The Empire Strikes Back",
            episode_id: 5,
            opening_crawl: "Opening Crawl 2",
            director: "Irvin Kershner",
            producer: "Gary Kurtz",
            release_date: "1980-05-21",
          },
          {
            title: "Return of the Jedi",
            episode_id: 6,
            opening_crawl: "Opening Crawl 3",
            director: "Richard Marquand",
            producer: "Howard G. Kazanjian",
            release_date: "1983-05-25",
          },
        ],
      }),
  })
) as jest.Mock;

describe("MovieApp", () => {
  beforeEach(() => {
    render(<MovieApp />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Movies are fetched and rendered correctly
  test("fetches and renders the movie list", async () => {
    await screen.findByText(/A New Hope/i); // Wait for the API response and render

    expect(screen.getByText(/A New Hope/i)).toBeInTheDocument();
    expect(screen.getByText(/The Empire Strikes Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Return of the Jedi/i)).toBeInTheDocument();
  });

  // Test 2: Search functionality filters movies correctly
  test("filters the movie list based on the search input", async () => {
    await screen.findByText(/A New Hope/i);

    const searchInput = screen.getByPlaceholderText(/Search for movies.../i);

    // Simulate typing 'Empire' into the search bar
    userEvent.type(searchInput, "Empire");

    expect(screen.getByText(/The Empire Strikes Back/i)).toBeInTheDocument();
    expect(screen.queryByText(/A New Hope/i)).not.toBeInTheDocument();
  });

  // Test 3: Sorting by episode
  test("sorts the movie list by episode", async () => {
    await screen.findByText(/A New Hope/i);

    const sortSelect = screen.getByLabelText(/Sort by Episode/i);

    // Simulate changing the sort option to 'Episode'
    userEvent.selectOptions(sortSelect, "episode");

    const sortedMovies = screen.getAllByRole("listitem");

    // Check if the movies are sorted by episode number
    expect(sortedMovies[0]).toHaveTextContent("A New Hope (Episode 4)");
    expect(sortedMovies[1]).toHaveTextContent(
      "The Empire Strikes Back (Episode 5)"
    );
    expect(sortedMovies[2]).toHaveTextContent("Return of the Jedi (Episode 6)");
  });

  // Test 4: Sorting by release year
  test("sorts the movie list by release year", async () => {
    await screen.findByText(/A New Hope/i);

    const sortSelect = screen.getByLabelText(/Sort by Release Year/i);

    // Simulate changing the sort option to 'Release Year'
    userEvent.selectOptions(sortSelect, "year");

    const sortedMovies = screen.getAllByRole("listitem");

    // Check if the movies are sorted by release year
    expect(sortedMovies[0]).toHaveTextContent("A New Hope (Episode 4)");
    expect(sortedMovies[1]).toHaveTextContent(
      "The Empire Strikes Back (Episode 5)"
    );
    expect(sortedMovies[2]).toHaveTextContent("Return of the Jedi (Episode 6)");
  });

  // Test 5: Click a movie to see the details
  test("shows movie details when a movie is selected", async () => {
    await screen.findByText(/A New Hope/i);

    const movieItem = screen.getByText(/A New Hope/i);

    // Simulate clicking on the movie
    userEvent.click(movieItem);

    // Check if the details for the selected movie are shown
    expect(screen.getByText(/Director: George Lucas/i)).toBeInTheDocument();
    expect(screen.getByText(/Producers: Gary Kurtz/i)).toBeInTheDocument();
    expect(screen.getByText(/Opening Crawl 1/i)).toBeInTheDocument();
  });
});
function expect(arg0: any) {
  throw new Error("Function not implemented.");
}
