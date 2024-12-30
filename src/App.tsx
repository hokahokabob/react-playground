import { Suspense } from "react";
import "./App.css";
import { fetchCards } from "./web-api";
import YuGiOhCardsContainer, { YuGiOhCard } from "./YuGiOhCards";

// const url =
//   "https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark%20Magician";
const url =
  "https://db.ygoprodeck.com/api/v7/cardinfo.php?&sort=name&type=Normal%20Monster&race=Dragon,Spellcaster";

export default function App() {
  const cardsPromiseData: Promise<YuGiOhCard[]> = fetchCards(url);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <YuGiOhCardsContainer cardsPromise={cardsPromiseData} />
    </Suspense>
  );
}
