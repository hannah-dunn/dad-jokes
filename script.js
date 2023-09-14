const fetchJoke = async () => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to get Joke");
  }
  const data = await response.json();
  return data.joke;
};

const searchForJoke = async (searchTerm, limit = 5, page = 1) => {
  const response = await fetch(
    `https://icanhazdadjoke.com/search?term=${searchTerm}&limit=${limit}&page=${page}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to search");
  }
  const data = await response.json();
  if (data.results.length < 1) {
    throw new Error("No jokes match " + searchTerm);
  }
  return data.results.map((jokeData) => jokeData.joke);
};

// fetchJoke().then((joke) => console.log(joke));
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  const ul = document.querySelector("ul");
  const errorDiv = document.querySelector("#errorMessage");
  errorDiv.innerHTML = "";
  ul.innerHTML = "";
  e.preventDefault();
  try {
    const formData = new FormData(form);
    const term = formData.get("term");
    const limit = formData.get("limit");
    const jokes = await searchForJoke(term, limit);
    jokes.forEach((joke) => {
      const jokeText = document.createTextNode(joke);
      const li = document.createElement("li");
      li.appendChild(jokeText);
      ul.appendChild(li);
    });
  } catch (e) {
    errorDiv.innerHTML = `<p style="color:red">${e.message}</p>`;
  } finally {
    form.reset();
  }
});
