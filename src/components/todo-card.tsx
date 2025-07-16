import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type Todo = {
  id: string;
  title: string;
};

export const TodoCard = ({ todo }: { todo: Todo }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    data: {
      type: "Task",
      todo,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 bg-gray-200 rounded-lg"
      >
        Dragging...
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        <CardHeader>
          <CardTitle>{todo.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>ID: {todo.id}</p>
        </CardContent>
      </Card>
    </div>
  );
};