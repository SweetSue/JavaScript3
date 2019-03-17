'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        // createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });

        // NEW
        createAndAppend('header', root, { id: 'pageHeader' });
        createAndAppend('h1', pageHeader, { id: 'pageTitle', text: 'HYF Repositories' });
        createAndAppend('select', pageHeader, { id: 'selectOption', class: 'repo-selector' });
        loadOptions(data);

        createAndAppend('div', root, { id: 'repository' });
        loadInformations(data[0]);

        createAndAppend('div', root, { id: 'contributors' });
        createAndAppend('h2', contributors, { id: 'contributorsTitle', text: 'Contributors' });
        createAndAppend('ul', contributors, { id: 'contributorsList' });
        loadContributors(data);
        // END NEW
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

  // END Source
  // see the original https://hyf-github.netlify.com/

  // Choose Repository: Display all options OBS!!! NOT SORTED YET !!!
  function loadOptions(source) {
    for (let i = 0; i < source.length; i++) {
      createAndAppend('option', selectOption, {
        value: i,
        text: source[i].name,
        class: 'repo-options',
      });
    }
  }

  // Display Repository Information
  function loadInformations(element) {
    let repoInfos = createAndAppend('ul', repository, { id: 'repoInfos' });
    createListElement('Repository: ', element.name);
    createListElement('Description: ', element.description);
    createListElement('Forks : ', element.forks);
    createListElement('Updated: ', element.updated_at);

    function createListElement(label, description) {
      let li = createAndAppend('li', repoInfos, { class: 'repo-info' });
      createAndAppend('p', li, { text: label, class: 'label' });
      createAndAppend('p', li, { text: description, class: 'value' });
    }
  }
  // *********************** OK ***********************************
  // Display Contributors
}
