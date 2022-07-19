let addToy = false;
const URL = "http://localhost:3000/toys";

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");

  // GET the toy data
  fetch(URL)
    .then((response) => response.json())
    .then((toysArray) => createToyCards(toysArray)); // populate DOM with data

  function createToyCards(toysArray) {
    toysArray.forEach((toyObj) => createToyCard(toyObj));
  }

  // create a toy card for every toy obj
  // E.g. {
  //  "id": 1,
  //  "name": "Woody",
  //  "image": "http://www.pngmart.com/files/3/Toy-Story-Woody-PNG-Photos.png",
  //  "likes": 33
  // }
  function createToyCard(data) {
    // Create a new DOM node
    const toyNode = document.createElement("div");
    toyNode.classList.add("card");

    // Modify the content
    toyNode.innerHTML = `<h2>${data.name}</h2>
                        <img src=${data.image} class="toy-avatar" />
                        <p>${data.likes} Likes </p>
                        <button class="like-btn">Like <3</button>`;

    // add event listener to like button
    const likeBtn = toyNode.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      // target sibling paragraph tag
      const prevParagraphNode = likeBtn.previousElementSibling;

      // extract num of likes from sibling paragraph tag
      const numLikes = parseInt(prevParagraphNode.textContent.split(" ")[0]);
      const newLikes = numLikes + 1;

      //  fire off patch to increase likes
      fetch(`${URL}/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          likes: newLikes,
        }),
      })
        .then((response) => response.json())
        .then(() => (prevParagraphNode.textContent = `${newLikes} Likes`));
    });

    // Append it to #toy-collection
    toyCollection.appendChild(toyNode);
  }

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // When a user submits the toy form, two things should happen:
  // a POST request should be sent to http://localhost:3000/toys and the new toy added to Andy's Toy Collection.

  toyFormContainer.addEventListener("submit", (event) => {
    // prevent the default behavior, i.e. prevent the page reload
    event.preventDefault();

    // grab the info from the form
    const name = event.target.name.value;
    const image = event.target.image.value;

    // put said info inside of an object
    const newToyData = {
      name,
      image,
      likes: 0,
    };

    // and send it in a POST request to the backend
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToyData),
    })
      .then((response) => response.json())
      .then((data) => {
        createToyCard(data);
        event.target.reset();
        window.alert("New toy successfully made!");
      }); // If the post is successful, add the toy to the DOM
  });

  // toy-collection div
  //  if event.target is like button, update likes
});
