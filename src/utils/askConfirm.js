export default function askConfirm(message) {
  try {
    return window.confirm(message);
  } catch (e) {
    return false;
  }
}
