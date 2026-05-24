'use strict';
/* jshint esversion: 6 */



const API_BASE = "https://api.github.com/users/";

async function loadUser(username) {
  const endpoint = API_BASE + encodeURIComponent(username);
  const response = await fetch(endpoint);

  if (!response.ok) {
    console.log("User not found");
    return;
  }

  const user = await response.json();

  console.log(user);

  const date = new Date(user.created_at);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const formatted = `${day} ${month} ${year}`;

  console.log(formatted);  

  document.querySelector("[data-avatar]").src = user.avatar_url;
  document.querySelector("[data-name]").textContent = user.name || user.login;
  document.querySelector("[data-username]").textContent = "@" + user.login;
  document.querySelector("[data-created_at]").textContent = formatted || "Not Available";
  document.querySelector("[data-bio]").textContent = user.bio || "This profile has no bio";
  document.querySelector("[data-repos]").textContent = user.public_repos;
  document.querySelector("[data-followers]").textContent = user.followers;
  document.querySelector("[data-following]").textContent = user.following;
  document.querySelector("[data-location]").textContent = user.location || "Not Available";
  document.querySelector("[data-blog]").textContent = user.blog || "Not Available";
  document.querySelector("[data-twitter]").textContent = user.twitter_username || "Not Available";
  document.querySelector("[data-company]").textContent = user.company || "Not Available";
}

loadUser("octocat");