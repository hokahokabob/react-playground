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
  deckBalance: number; // After drawing certain number of cards, the duel ends
  shouldStopDrawing: boolean;
};

const DEFAULT_DECK_BALANCE = 15;

function randomIndex(deckSize: number): number {
  return Math.floor(Math.random() * deckSize);
}

async function drawCard({
  deckSize,
  deckBalance,
}: DeckCondition): Promise<DeckCondition> {
  if (deckBalance === 0) {
    return {
      cardIndex: -1,
      deckSize,
      deckBalance: 0,
      shouldStopDrawing: true,
    } as DeckCondition;
  }
  const newIndex = randomIndex(deckSize); // Find a card randomly
  const newDeckBalance = deckBalance - 1;
  return {
    cardIndex: newIndex,
    deckSize,
    deckBalance: newDeckBalance,
  } as DeckCondition;
}

const Hanase = () => {
  return (
    <div className="container mx-auto p-4">
      <p className="text-3xl font-bold mb-4">もうやめて！</p>
      <img src="/ha_na_se.jpg" />
      <p className="text-3xl font-bold mt-4">HA NA SE</p>
    </div>
  );
};

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
    deckBalance: DEFAULT_DECK_BALANCE,
    shouldStopDrawing: false,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Yu-Gi-Oh! Cards</h1>
      <form className="mb-4">
        <button
          formAction={formAction}
          className="bg-amber-700 hover:bg-amber-900 text-white font-bold py-2 px-4 rounded"
        >
          Draw Card
        </button>
      </form>
      {deckConditionState.shouldStopDrawing ? (
        <Hanase />
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">ATK</th>
              <th className="py-2 px-4 border-b">DEF</th>
              <th className="py-2 px-4 border-b">Level</th>
              <th className="py-2 px-4 border-b">Race</th>
              <th className="py-2 px-4 border-b">Attribute</th>
              <th className="py-2 px-4 border-b">Image</th>
            </tr>
          </thead>
          <tbody>
            {cards
              .filter((_card, index) => index === deckConditionState.cardIndex)
              .map((card) => (
                <tr key={card.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b font-mono">{card.id}</td>
                  <td className="py-2 px-4 border-b font-mono font-semibold">
                    {card.name}
                  </td>
                  <td className="py-2 px-4 border-b">{card.desc}</td>
                  <td className="py-2 px-4 border-b font-mono font-semibold">
                    {card.atk}
                  </td>
                  <td className="py-2 px-4 border-b font-mono font-semibold">
                    {card.def}
                  </td>
                  <td className="py-2 px-4 border-b font-mono">{card.level}</td>
                  <td className="py-2 px-4 border-b">{card.race}</td>
                  <td className="py-2 px-4 border-b">{card.attribute}</td>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={card.card_images[0].image_url_small}
                      alt={card.name}
                      className="min-w-36"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
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
