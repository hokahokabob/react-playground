import { YuGiOhCard } from "./YuGiOhCards";

export const fetchCards: (url: string) => Promise<YuGiOhCard[]> = async (
  url: string
) => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.data as YuGiOhCard[];
    })
    .catch((error) => {
      console.error(error);
      return [] as YuGiOhCard[];
    });
};
