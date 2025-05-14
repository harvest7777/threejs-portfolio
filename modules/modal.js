// why is this unexpected token export when it is clearly imported as a module???
export function openModal() {
  document.getElementById("modal").classList.remove("hidden");
}

export function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}
