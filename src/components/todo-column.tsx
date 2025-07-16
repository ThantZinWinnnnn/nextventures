import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { Todo, TodoCard } from "./todo-card";
import { Column } from "./todo-list";

export const TodoColumn = ({
  column,
  todos,
}: {
  column: Column;
  todos: Todo[];
}) => {
  const todosIds = useMemo(() => {
    return todos.map((todo) => todo.id);
  }, [todos]);

  const { setNodeRef } = useSortable({
    id: column.id,
    data: useMemo(() => ({ type: "Column", column }), [column]),
  });

  return (
    <div ref={setNodeRef} className="flex flex-col w-80">
      <h2 className="text-lg font-bold">{column.title}</h2>
      <div className="flex flex-col gap-4 mt-4">
        <SortableContext items={todosIds}>
          {todos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
