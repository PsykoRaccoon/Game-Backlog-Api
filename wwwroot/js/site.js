const columns = { Backlog: 'cards-backlog', Playing: 'cards-playing', Completed: 'cards-completed' };
const counts = { Backlog: 'count-backlog', Playing: 'count-playing', Completed: 'count-completed' };

async function loadGames() {
  const res = await fetch('/api/games');
  const games = await res.json();
  renderBoard(games);
}

function renderBoard(games) {
  Object.values(columns).forEach(id => document.getElementById(id).innerHTML = '');
  const tally = { Backlog: 0, Playing: 0, Completed: 0 };

  games.forEach(game => {
    const status = columns[game.status] ? game.status : 'Backlog';
    tally[status]++;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="title">${game.title}</div>
      <div class="platform">${game.platform}</div>
      <div class="card-footer">
        <span class="rating">${game.rating > 0 ? game.rating + '/10' : '—'}</span>
        <div>
          <select data-id="${game.id}" class="status-select">
            <option value="Backlog" ${status === 'Backlog' ? 'selected' : ''}>Backlog</option>
            <option value="Playing" ${status === 'Playing' ? 'selected' : ''}>Playing</option>
            <option value="Completed" ${status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
          <button class="delete-btn" data-id="${game.id}">Remove</button>
        </div>
      </div>
    `;
    document.getElementById(columns[status]).appendChild(card);
  });

  Object.entries(tally).forEach(([status, count]) => {
    document.getElementById(counts[status]).textContent = count;
  });

  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', e => updateStatus(e.target.dataset.id, e.target.value));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => deleteGame(e.target.dataset.id));
  });
}

async function addGame(event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const platform = document.getElementById('platform').value;
  const rating = parseInt(document.getElementById('rating').value, 10);

  await fetch('/api/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, platform, status: 'Backlog', rating })
  });

  event.target.reset();
  loadGames();
}

async function updateStatus(id, status) {
  const res = await fetch(`/api/games/${id}`);
  const game = await res.json();
  game.status = status;
  await fetch(`/api/games/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game)
  });
  loadGames();
}

async function deleteGame(id) {
  await fetch(`/api/games/${id}`, { method: 'DELETE' });
  loadGames();
}

document.getElementById('add-game-form').addEventListener('submit', addGame);
loadGames();