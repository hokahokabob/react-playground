"use client";

import { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";

export type YuGiOhCard = {
  id: number;
  name: string;
  desc: string;
  atk: number;
  def: number;
  level: number;
  race: string;
  attribute: string;
  card_images: CardImages[];
};

export type CardImages = {
  image_url_small: string;
};

function YuGiOhCards(
  {cardsPromise}: {cardsPromise: Promise<YuGiOhCard[]>}
) {
  const cards: YuGiOhCard[] = use(cardsPromise);
  return (
    <div>
      <h1>Yu-Gi-Oh! Cards</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>ATK</th>
            <th>DEF</th>
            <th>Level</th>
            <th>Race</th>
            <th>Attribute</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.name}</td>
              <td>{card.desc}</td>
              <td>{card.atk}</td>
              <td>{card.def}</td>
              <td>{card.level}</td>
              <td>{card.race}</td>
              <td>{card.attribute}</td>
              <td>
                <img src={card.card_images[0].image_url_small} alt={card.name} width="200px"/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function YuGiOhCardsContainer(
  {cardsPromise}: {cardsPromise: Promise<YuGiOhCard[]>}
) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<div>Loading...</div>}>
        <YuGiOhCards cardsPromise={cardsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
