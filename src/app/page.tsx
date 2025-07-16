import { ModeToggle } from "@/components/theme-toggle";
import { TodoList } from "@/components/todo-list";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <h1 className="text-4xl font-bold mb-8">Todo List</h1>
      <TodoList />
    </main>
  );
}