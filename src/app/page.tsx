import { unstable_noStore as noStore } from "next/cache";
import Chart from "./_components/Chart";

// import { CreatePost } from "~/app/_components/create-post";
// import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  // const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center text-white">
      <div className="flex w-full max-w-7xl flex-col items-center justify-center">
        <Chart />
        {/* <CrudShowcase /> */}
      </div>
    </main>
  );
}

// async function CrudShowcase() {
//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
