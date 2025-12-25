import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, MessageSquare, Paperclip } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { gsap } from "gsap";
import { priorityColors, type BoardColumn } from "@/data/projects/board";
import { getProjectBoard } from "@/data/projects/get-project-data";

const columnColors = {
  todo: "border-l-4 border-l-slate-500",
  "in-progress": "border-l-4 border-l-blue-500",
  review: "border-l-4 border-l-yellow-500",
  done: "border-l-4 border-l-green-500",
};

export function ProjectBoardView({ projectId }: { projectId: string }) {
  const [boardState, setBoardState] = useState(getProjectBoard(projectId));
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = boardState.find(
      (col) => col.id === source.droppableId,
    );
    const destColumn = boardState.find(
      (col) => col.id === destination.droppableId,
    );

    if (!sourceColumn || !destColumn) return;

    const newBoard = [...boardState];
    const sourceColumnIndex = newBoard.findIndex(
      (col) => col.id === source.droppableId,
    );
    const destColumnIndex = newBoard.findIndex(
      (col) => col.id === destination.droppableId,
    );

    const sourceTasks = [...(sourceColumn.tasks || [])];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      newBoard[sourceColumnIndex] = { ...sourceColumn, tasks: sourceTasks };
    } else {
      const destTasks = [...(destColumn.tasks || [])];
      destTasks.splice(destination.index, 0, movedTask);
      newBoard[sourceColumnIndex] = { ...sourceColumn, tasks: sourceTasks };
      newBoard[destColumnIndex] = { ...destColumn, tasks: destTasks };
    }

    setBoardState(newBoard);
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      toast.error("Please enter a column name");
      return;
    }

    const newColumn: BoardColumn = {
      id: newColumnName.toLowerCase().replace(/\s+/g, "-"),
      title: newColumnName,
      tasks: [],
    };

    setBoardState([...boardState, newColumn]);
    setNewColumnName("");
    setIsColumnDialogOpen(false);
  };

  // Initial animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        {
          y: -40,
          opacity: 0,
          filter: "blur(15px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [projectId]);

  return (
    <div ref={containerRef} className="space-y-4 overflow-hidden">
      <div ref={headerRef} className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Board</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {boardState.reduce((acc, col) => acc + (col.tasks?.length || 0), 0)}{" "}
            tasks across {boardState.length} columns
          </p>
        </div>
        <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Column
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-wrapper">
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
              <DialogDescription>
                Create a new column for your board
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="dialog-field">
                <Label htmlFor="column-name">Column Name</Label>
                <Input
                  id="column-name"
                  placeholder="e.g., Testing, Deployed, etc."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddColumn} className="w-full dialog-field">
                Create Column
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-hidden pb-4 ">
          {boardState.map((column) => (
            <div
              key={column.id}
              className="kanban-column flex flex-col bg-muted/30 rounded-lg p-3 min-w-[320px] flex-shrink-0"
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      column.id === "todo"
                        ? "bg-slate-500"
                        : column.id === "in-progress"
                          ? "bg-blue-500"
                          : column.id === "review"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    }`}
                  />
                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                    {column.title}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {column.tasks?.length || 0}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 flex-1 min-h-[200px] p-2 rounded-md transition-colors overflow-hidden ${
                      snapshot.isDraggingOver 
                        ? "bg-muted/50 border border-dashed border-primary" 
                        : "bg-muted/20"
                    }`}
                  >
                    {(column.tasks || []).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-transform ${
                              snapshot.isDragging && "scale-[1.1]"
                            }`}
                          >
                            <Card
                              className={`${
                                snapshot.isDragging
                                  ? "shadow-2xl -translate-y-25 -translate-x-10"
                                  : "hover:shadow-md"
                              } ${columnColors[column.id as keyof typeof columnColors] || ""} transition-shadow duration-200`}
                            >
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium text-sm leading-snug flex-1">
                                    {task.title}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 -mt-1 -mr-1"
                                  >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
              
                                {task.labels && task.labels.length > 0 && (
                                  <div className="flex gap-1.5 flex-wrap">
                                    {task.labels.map((label, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="text-xs px-2 py-0"
                                      >
                                        {label}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
              
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    {task.comments !== undefined && (
                                      <div className="flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>{task.comments}</span>
                                      </div>
                                    )}
                                    {task.attachments !== undefined && (
                                      <div className="flex items-center gap-1">
                                        <Paperclip className="w-3.5 h-3.5" />
                                        <span>{task.attachments}</span>
                                      </div>
                                    )}
                                    <Badge
                                      variant="outline"
                                      className={`${priorityColors[task.priority]} text-xs px-1.5 py-0`}
                                    >
                                      {task.priority}
                                    </Badge>
                                  </div>
              
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {task.avatar || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>


              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 gap-2 justify-start text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4" />
                Add card
              </Button>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
