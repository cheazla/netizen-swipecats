export const getCats = async (limit: number = 10) => {
  const cats = [];
  for (let i = 0; i < limit; i++) {
    cats.push({
      id: i + 1,
      url: `https://cataas.com/cat?${Date.now()}-${i}`,
    });
  }
  return cats;
};
