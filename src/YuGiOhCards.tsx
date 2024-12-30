"use client";

import { Suspense, use, useActionState } from "react";
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

type DeckCondition = {
  cardIndex: number;
  deckSize: number;
};

function randomIndex(deckSize: number): number {
  return Math.floor(Math.random() * deckSize);
}

async function drawCard({ deckSize }: DeckCondition): Promise<DeckCondition> {
  const newIndex = randomIndex(deckSize);
  return { cardIndex: newIndex, deckSize } as DeckCondition;
}

function YuGiOhCards({
  cardsPromise,
}: {
  cardsPromise: Promise<YuGiOhCard[]>;
}) {
  const cards: YuGiOhCard[] = use(cardsPromise);
  const deckSize = cards.length;
  const [deckConditionState, formAction] = useActionState(drawCard, {
    cardIndex: randomIndex(deckSize),
    deckSize,
  });

  return (
    <div>
      <h1>Yu-Gi-Oh! Cards</h1>
      <form>
        <button formAction={formAction}>Draw Card</button>
      </form>
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
          {cards
            .filter((_card, index) => index === deckConditionState.cardIndex)
            .map((card) => (
              <tr key={card.id}>
                <td>{card.id}</td>
                <td className="font-mono font-semibold">{card.name}</td>
                <td>{card.desc}</td>
                <td className="font-mono font-semibold">{card.atk}</td>
                <td className="font-mono font-semibold">{card.def}</td>
                <td className="font-mono">{card.level}</td>
                <td>{card.race}</td>
                <td>{card.attribute}</td>
                <td>
                  <img
                    src={card.card_images[0].image_url_small}
                    alt={card.name}
                    width="200px"
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default function YuGiOhCardsContainer({
  cardsPromise,
}: {
  cardsPromise: Promise<YuGiOhCard[]>;
}) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<div>Loading...</div>}>
        <YuGiOhCards cardsPromise={cardsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
