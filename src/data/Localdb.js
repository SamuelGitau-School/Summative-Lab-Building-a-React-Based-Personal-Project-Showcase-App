export function getCollection(key, seedData = []) {
  const raw = localStorage.getItem(key)
  if (raw) {
    return JSON.parse(raw)
  }
  localStorage.setItem(key, JSON.stringify(seedData))
  return seedData
}

export function setCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}