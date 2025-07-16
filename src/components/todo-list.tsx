"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { TodoCard, Todo } from "./todo-card";
import { TodoColumn } from "./todo-column";
import { createPortal } from "react-dom";

export type ColumnId = "todo" | "in-progress" | "done";

export type Column = {
  id: ColumnId;
  title: string;
};

export type TodoWithColumn = Todo & {
  columnId: ColumnId;
};

export const TodoList = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [todos, setTodos] = useState<TodoWithColumn[]>([
    { id: "1", title: "Task 1", columnId: "todo" },
    { id: "2", title: "Task 2", columnId: "todo" },
    { id: "3", title: "Task 3", columnId: "in-progress" },
    { id: "4", title: "Task 4", columnId: "done" },
  ]);

  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTodo(event.active.data.current.todo);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTodo(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveATask) return;

    setTodos((todos) => {
      const activeIndex = todos.findIndex((t) => t.id === activeId);
      const overIndex = todos.findIndex((t) => t.id === overId);

      if (todos[activeIndex].columnId != todos[overIndex].columnId) {
        todos[activeIndex].columnId = todos[overIndex].columnId;
        return arrayMove(todos, activeIndex, overIndex - 1);
      }

      return arrayMove(todos, activeIndex, overIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTodos((todos) => {
        const activeIndex = todos.findIndex((t) => t.id === activeId);
        const overIndex = todos.findIndex((t) => t.id === overId);
        if (todos[activeIndex].columnId != todos[overIndex].columnId) {
          todos[activeIndex].columnId = todos[overIndex].columnId;
          return arrayMove(todos, activeIndex, overIndex);
        }

        return arrayMove(todos, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTodos((todos) => {
        const activeIndex = todos.findIndex((t) => t.id === activeId);
        todos[activeIndex].columnId = overId as ColumnId;
        return arrayMove(todos, activeIndex, activeIndex);
      });
    }
  };

  const todosByColumn = useMemo(() => {
    return columns.reduce((acc, col) => {
      acc[col.id] = todos.filter((todo) => todo.columnId === col.id);
      return acc;
    }, {} as Record<ColumnId, TodoWithColumn[]>);
  }, [columns, todos]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex gap-8">
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <TodoColumn
              key={col.id}
              column={col}
              todos={todosByColumn[col.id] ?? []}
            />
          ))}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay>
          {activeTodo && <TodoCard todo={activeTodo} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
