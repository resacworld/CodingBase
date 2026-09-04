import Image from "next/image";

export default async function Home() {
  const timeout = await setTimeout(() => {}, 0);

  return (
    <div>
      Bonsoir  3
    </div>
  );
}
