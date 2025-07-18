import { PostList } from "~/app/_components/post";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {  

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">T3</span> BlogKnow
          </h1>
          {/* <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
          </div>   */}
        
          <div className="flex w-full justify-center">
            <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-start justify-center gap-12">
              <PostList />
              {/* <UserList /> */}
            </div>
          </div>

        
        </div>
      </main>
    </HydrateClient>
  );
}
