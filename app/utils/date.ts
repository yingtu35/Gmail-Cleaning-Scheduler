export const epochToDate = (epoch: number | undefined) => {
  if (!epoch) {
    return new Date();
  }
  return new Date(epoch * 1000);
}

export const isEndDateLarger = (startDate: string, endDate: string): Boolean => {
  return new Date(startDate) < new Date(endDate);
}