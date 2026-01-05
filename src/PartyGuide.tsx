import { useEffect, useState } from "react";

export default function PartyGuide() {
    const [guideTexts, setGuideTexts] = useState<Record<number, string>>({});
    const imageCount = 7;

    useEffect(() => {
        fetch("/tmp.txt")
            .then((res) => res.text())
            .then((text) => {
                const lines = text.split("\n");
                const mapping: Record<number, string> = {};

                lines.forEach((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return;

                    // Match "1. Text" format
                    const match = trimmed.match(/^(\d+)\.(.*)$/);
                    if (match) {
                        const num = parseInt(match[1], 10);
                        const content = match[2].trim();

                        if (mapping[num]) {
                            // If multiple lines exist for the same number, append them
                            mapping[num] += "\n" + content;
                        } else {
                            mapping[num] = content;
                        }
                    }
                });

                setGuideTexts(mapping);
            })
            .catch((err) => console.error("Failed to load guide texts:", err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
                    Party Location Guide
                </h1>

                <div className="space-y-12">
                    {Array.from({ length: imageCount }).map((_, index) => {
                        const stepNum = index + 1;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg flex flex-col md:flex-row items-center"
                            >
                                <div className="relative flex-shrink-0 overflow-hidden mx-auto mt-4 w-full" style={{ maxWidth: '400px', aspectRatio: '4/3' }}>
                                    {/* Images are in public/image-X.png. 
                         Note: public/ assets are served at root path / */}
                                    <img
                                        src={`/image-${stepNum}.png`}
                                        alt={`Guide step ${stepNum}`}
                                        className="absolute inset-0 w-full h-full object-cover object-center"
                                    />
                                </div>
                                <div className="p-6 my-4 mx-auto w-full dark:bg-gray-800" style={{ maxWidth: '400px' }}>
                                    {/* <div className="flex items-center mb-4">
                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold">
                                            {stepNum}
                                        </span>
                                        <h2 className="ml-3 text-xl font-medium text-gray-900">
                                            Step {stepNum}
                                        </h2>
                                    </div> */}
                                    <p className="text-gray-600 dark:text-gray-200 text-lg whitespace-pre-wrap">
                                        {guideTexts[stepNum] || "Loading instructions..."}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
