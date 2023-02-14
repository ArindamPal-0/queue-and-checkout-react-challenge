import { useEffect, useState } from "react";
import Queue from "./components/Queue";

function App() {
    const [input, setInput] = useState<number>(0);
    const [queues, setQueues] = useState<number[][]>([]);

    useEffect(() => {
        initializeQueues();

        return () => {
            setQueues([]);
        };
    }, []);

    function initializeQueues() {
        setQueues([[], [5], [2, 4], [], [1]]);
    }

    function onCheckout(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log(`value: ${input}`);

        if (input <= 0) {
            console.error("atleast one item should be there for checkout.");
            return;
        }

        // select appropriate queue and add new Customer
        const newQueues = [...queues.map((queue) => [...queue])];
        let prevItemCount = Infinity,
            indexMinItems = 3;
        for (let i = 0; i < newQueues.length; i++) {
            const itemCount = newQueues[i].reduce(
                (prevValue, curValue) => prevValue + curValue,
                0
            );

            if (prevItemCount > itemCount) {
                prevItemCount = itemCount;
                indexMinItems = i;
            }

            // console.log(`${i} ${prevItemCount} ${indexMinItems}`);
        }

        newQueues[indexMinItems].push(input);

        setQueues(newQueues);

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
                <section className="flex w-full items-center justify-center gap-3 border-b border-t border-b-blue-200 border-t-blue-200 p-5">
                    <button
                        className="rounded bg-red-600 px-3 py-1 text-xl text-white hover:bg-red-500"
                        onClick={() => initializeQueues()}
                    >
                        Reset
                    </button>
                </section>
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
