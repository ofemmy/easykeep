export default function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1, word.length);
}
