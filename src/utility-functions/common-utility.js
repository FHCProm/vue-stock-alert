export default function common() {
  let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  return { sleep };
}
