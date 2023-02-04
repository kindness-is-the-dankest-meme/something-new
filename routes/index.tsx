import { Head } from "$fresh/runtime.ts";
import Kaboom from "../islands/Kaboom.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Something New</title>
      </Head>
      <main class="flex w-full h-full">
        <Kaboom />
      </main>
    </>
  );
}
