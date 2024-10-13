export const epochToDate = (epoch: number | undefined) => {
  if (!epoch) {
    return new Date();
  }
  return new Date(epoch * 1000);
}