export function formatMT(amount: number): string {
  return `${amount.toLocaleString("en-US").replace(/,/g, " ")} MT`;
}
