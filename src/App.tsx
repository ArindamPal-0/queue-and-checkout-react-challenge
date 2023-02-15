import { useEffect, useReducer, useState } from "react";
import pauseIcon from "./assets/player-pause.svg";
import playIcon from "./assets/player-play.svg";
import stopIcon from "./assets/player-stop.svg";
import Queue from "./components/Queue";

type SimulationState = "running" | "paused" | "stopped";

function App() {
    const [input, setInput] = useState<number>(0);
    const [queues, setQueues] = useState<number[][]>([]);

    function stateReducer(
        state: SimulationState,
        action: { next: SimulationState }
    ) {
        switch (action.next) {
            case "running":
                if (state === "paused" || state === "stopped") {
                    return action.next;
                } else {
                    // throw new Error("running -> running ❌");
                }
                break;
            case "paused":
                if (state === "running") {
                    return action.next;
                } else {
                    // throw new Error("stopped | paused -> paused ❌");
                }
                break;
            case "stopped":
                if (state !== "stopped") {
                    return action.next;
                } else {
                    // throw new Error("Simulation is already stopped");
                }
                break;
            // default:
            // throw new Error(`Unknown Action ${action.next}`);
        }
        return state;
    }

    const initialState: SimulationState = "stopped";

    const [state, stateDispatch] = useReducer(stateReducer, initialState);

    const [timer, setTimer] = useState<number>(0);

    // on State Change
    useEffect(() => {
        console.log("onStateChange");
        if (state === "stopped") {
            setTimer(0);
        }

        // TODO: make efficient setInterval
        // i.e. only create setInterval when state = "running"

        // setup setInterval on Component mount
        const id = setInterval(() => {
            if (state === "running") {
                setTimer((value) => value + 1);
            }
            // console.log(`${id}: running`);
        }, 1000);
        console.log(`setInterval setup with id: ${id}.`);

        return () => {
            // clear setInterval on Component unmount
            clearInterval(id);
            console.log(`setInterval with id: ${id} cleared.`);
        };
    }, [state]);

    // on Component Mount
    useEffect(() => {
        // initialize state to "stopped"
        stateDispatch({ next: "stopped" });

        // set queues to initial value
        initializeQueues();

        // set timer value to zero
        setTimer(0);

        return () => {
            stateDispatch({ next: "stopped" });
            setQueues([]);
            setTimer(0);
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

    // simulate to run each second
    function simulationStep() {
        if (state === "running") {
            const tempQueues = [...queues.map((queue) => [...queue])];

            // iterate through all the queues
            // and remove 1 item from the queue front customer
            for (let i = 0; i < tempQueues.length; i++) {
                const queue = tempQueues[i];
                if (queue.length > 0) {
                    queue[0] = queue[0] - 1;

                    // if all items from customer checks out
                    // then remove the customer from queue
                    if (queue[0] === 0) {
                        queue.shift();
                    }
                }
            }

            // update the queues
            setQueues(tempQueues);

            // calculate total number of items left
            const totalItemsCount = tempQueues
                .map((queue) => queue.length)
                .reduce((prevValue, curValue) => prevValue + curValue, 0);

            // if all queues are empty then stop the simulation
            if (totalItemsCount === 0) {
                stateDispatch({ next: "stopped" });
            }
        }
    }

    // on Timer Change
    useEffect(() => {
        // console.log(`timer: ${timer}`);
        simulationStep();
        // do simulation stuffs
    }, [timer]);

    return (
        <section className="flex h-screen flex-col justify-start">
            <header>
                <h1 className="border-b-2 border-b-blue-300 p-4 text-center text-3xl font-bold text-blue-600 underline">
                    Checkout Queue
                </h1>
            </header>
            <main className="mt-5 flex flex-grow flex-col items-center justify-start gap-2">
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
                        className="rounded bg-red-600 px-3 py-2 text-xl text-white hover:bg-red-500"
                        onClick={() => initializeQueues()}
                    >
                        Reset
                    </button>
                    <div className="flex items-center justify-center gap-2 rounded border-2 border-red-600 px-3 py-1">
                        <span className="text-xl text-red-600">Simulate</span>
                        <button
                            className="rounded-full bg-red-600 p-1 disabled:bg-red-400"
                            disabled={state === "running"}
                            onClick={() => stateDispatch({ next: "running" })}
                        >
                            <img src={playIcon} alt="play" />
                        </button>
                        <button
                            className="rounded-full bg-red-600 p-1 disabled:bg-red-400"
                            disabled={state !== "running"}
                            onClick={() => stateDispatch({ next: "paused" })}
                        >
                            <img src={pauseIcon} alt="pause" />
                        </button>
                        <button
                            className="rounded-full bg-red-600 p-1 disabled:bg-red-400"
                            disabled={state === "stopped"}
                            onClick={() => stateDispatch({ next: "stopped" })}
                        >
                            <img src={stopIcon} alt="stop" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded border-2 border-red-600 px-3 py-1">
                        <span className="text-xl text-red-600">Timer: </span>
                        <span className="text-2xl font-semibold text-red-600">
                            {timer}
                        </span>
                    </div>
                </section>
                <section className="flex flex-col gap-1 py-5">
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
