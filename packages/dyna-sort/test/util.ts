export function shuffle<Type>(array: Type[]): Type[] {
  return [...array].sort(() => Math.random() - 0.5)
}
