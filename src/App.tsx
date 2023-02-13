import { useState } from "react";
import Queue from "./components/Queue";

function App() {
    const [input, setInput] = useState<number>(0);
    const [queues, setQueues] = useState<number[][]>([
        [],
        [5],
        [2, 4],
        [],
        [1],
    ]);

    function onCheckout(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log(`value: ${input}`);
        setInput(0);
    }

    return (
        <section>
            <header>
                <h1 className="border-b-2 border-b-blue-300 p-4 text-center text-3xl font-bold text-blue-600 underline">
                    Checkout Queue
                </h1>
            </header>
            <main className="mt-5 flex flex-col items-center justify-start gap-2">
                <form
                    className="flex h-24 items-center gap-4"
                    onSubmit={onCheckout}
                >
                    <input
                        type="number"
                        className="rounded border border-blue-200 p-1 
                        focus:border-2 focus:border-blue-600 focus:outline-none"
                        value={input}
                        onChange={(event) =>
                            setInput(parseInt(event.target.value))
                        }
                    />
                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-400"
                    >
                        checkout
                    </button>
                </form>
                <section className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-blue-600 underline">
                        Queue:
                    </h2>
                    <div className="flex gap-3">
                        {queues.map((queue, qIndex) => (
                            <Queue key={qIndex} queue={queue} qIndex={qIndex} />
                        ))}
                    </div>
                </section>
            </main>
        </section>
    );
}

export default App;
