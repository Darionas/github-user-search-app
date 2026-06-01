'use strict';
/* jshint esversion: 6 */

const themeBtn = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-toggle__label');
const moonIcon = document.querySelector('[data-theme-icon="moon"]');
const sunIcon = document.querySelector('[data-theme-icon="sun"]');
const searchInput = document.querySelector('.userName');
const searchBtn = document.querySelector('.searchBtn');
const notFoundMsg = document.querySelector('.notFoundmsg');
const blogLink = document.querySelector('[data-blog]');
const twitterLink = document.querySelector('[data-twitter]');
const avatarImage = document.querySelector('[data-avatar]');
const searchForm = document.querySelector('.search-bar');
const API_BASE = 'https://api.github.com/users/';

/* anchor element's make tabbable */
function normalizeUrl(url) {
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function setProfileLink(linkElement, rawValue, prefix) {
    if (!linkElement) return;

    if (!rawValue) {
        linkElement.textContent = 'Not Available';
        linkElement.removeAttribute('href');
        linkElement.setAttribute('aria-disabled', 'true');
        linkElement.setAttribute('tabindex', '-1');
        return;
    }

    const href = prefix ? `${prefix}${rawValue}` : normalizeUrl(rawValue);
    linkElement.textContent = rawValue;
    linkElement.setAttribute('href', href);
    linkElement.removeAttribute('aria-disabled');
    linkElement.removeAttribute('tabindex');
}

  /* Toggle dark & light theme */
function applyTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);

    const isDark = theme === 'dark';
    themeLabel.textContent = isDark ? 'Light' : 'Dark';
    themeBtn.setAttribute('aria-pressed', String(isDark));
    const nextTheme = isDark ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', `Switch to ${nextTheme} theme`);

    if (moonIcon && sunIcon) {
        moonIcon.classList.toggle('hidden', isDark);
        sunIcon.classList.toggle('hidden', !isDark);
    }
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeBtn.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
});

/* Fetch user data */
async function loadUser(username) {
    const endpoint = API_BASE + encodeURIComponent(username);
    notFoundMsg.classList.add('hidden');
    searchInput.setAttribute('aria-invalid', 'false');

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            console.log('User not found');
            notFoundMsg.classList.remove('hidden');
            searchInput.setAttribute('aria-invalid', 'true');
            return;
        }

        const user = await response.json(); 

        /* Convert fetched date to desirable format */
        const date = new Date(user.created_at);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        const formatted = `${day} ${month} ${year}`;

        /* Update avatar image's alt property */
        avatarImage.src = user.avatar_url;
        avatarImage.alt = `${user.login} profile avatar`;
    

        document.querySelector('[data-name]').textContent = user.name || user.login;
        document.querySelector('[data-username]').textContent = '@' + user.login;
        document.querySelector('[data-created_at]').textContent = formatted || 'Not Available';
        document.querySelector('[data-bio]').textContent = user.bio || 'This profile has no bio';
        document.querySelector('[data-repos]').textContent = user.public_repos;
        document.querySelector('[data-followers]').textContent = user.followers;
        document.querySelector('[data-following]').textContent = user.following;
        document.querySelector('[data-location]').textContent = user.location || 'Not Available';
        setProfileLink(blogLink, user.blog);
        setProfileLink(twitterLink, user.twitter_username, 'https://twitter.com/');
        document.querySelector('[data-company]').textContent = user.company || 'Not Available';
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        notFoundMsg.classList.remove('hidden');
        searchInput.setAttribute('aria-invalid', 'true');
    }
}

/* Load default user */
loadUser('octocat');

/* Upload user based on input */
function showUser() {
    const username = searchInput.value.trim();
    if (!username) return;
    loadUser(username);
}

if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        showUser();
    });
}

   
/* document.querySelectorAll('*').forEach(el => {
  if (el.scrollWidth > el.clientWidth) {
    console.log('⚠️ Horizontal overflow:', el);
    el.style.outline = '2px solid red';
  }
}); */
